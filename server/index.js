import 'dotenv/config'
import crypto from 'crypto'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPostcard } from './postgrid.js'
import { sendMailedEmail } from './email.js'

// Prefer the service-role key (server-side only — bypasses RLS) so the orders
// table can be locked down to deny the anon role. Falls back to anon until the
// service-role key is configured, so this is a safe no-op until then.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

const app  = express()
const port = process.env.PORT || 3001

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY is not set in .env')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))

// Lightweight per-IP rate limiting (in-memory). NOTE: on serverless each instance
// keeps its own counter, so this is best-effort — it blunts floods from a single
// source against a warm instance but is not a hard global guarantee. Back it with
// a shared store (e.g. Upstash Redis) for strict limits.
function rateLimit({ windowMs, max }) {
  const hits = new Map()
  return (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter(t => now - t < windowMs)
    if (recent.length >= max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000))
      return res.status(429).json({ error: 'Too many requests — please slow down.' })
    }
    recent.push(now)
    hits.set(ip, recent)
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < windowMs)) hits.delete(k)
    next()
  }
}
const paymentLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20 })
const youtubeLimiter = rateLimit({ windowMs: 10 * 60_000, max: 40 })

app.use('/api/webhook',          express.raw({ type: 'application/json' }))
app.use('/api/postgrid-webhook', express.raw({ type: () => true }))
app.use(express.json())

// ── Create PaymentIntent ─────────────────────────────────────
app.post('/api/create-payment-intent', paymentLimiter, async (req, res) => {
  const { label, youtubeUrl, color, cardBg, notes, senderName, email, cassetteId, orderNum, recipientName, address, senderAddress } = req.body

  if (!label || !youtubeUrl || !recipientName) {
    return res.status(400).json({ error: 'Missing required order fields' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   500,
      currency: 'usd',
      ...(email ? { receipt_email: email } : {}),
      metadata: {
        label, youtubeUrl, color, cardBg: cardBg || 'brown', notes: notes || '', senderName: senderName || '', cassetteId: cassetteId || '', orderNum: orderNum || '', recipientName,
        customerEmail:  email || '',
        addressLine1:   address?.line1   || '',
        addressLine2:   address?.line2   || '',
        addressCity:    address?.city    || '',
        addressState:   address?.state   || '',
        addressZip:     address?.zip     || '',
        addressCountry: address?.country || 'US',
        senderLine1:    senderAddress?.line1   || '',
        senderLine2:    senderAddress?.line2   || '',
        senderCity:     senderAddress?.city    || '',
        senderState:    senderAddress?.state   || '',
        senderZip:      senderAddress?.zip     || '',
        senderCountry:  senderAddress?.country || 'US',
      },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('PaymentIntent error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Stripe Webhook ───────────────────────────────────────────
app.post('/api/webhook', async (req, res) => {
  const sig    = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const metadata = pi.metadata
    console.log('Payment succeeded — firing PostGrid for:', metadata.label)
    try {
      const postcard = await sendPostcard(metadata)
      try {
        await stripe.paymentIntents.update(pi.id, {
          metadata: { ...metadata, postcardId: postcard.id, postcardStatus: postcard.status },
        })
      } catch (writeErr) {
        console.error('PostGrid succeeded but Stripe write-back failed — postcardId:', postcard.id, writeErr.message)
      }
      try {
        await supabase.from('orders').insert({
          stripe_payment_id: pi.id,
          cassette_label:    metadata.label,
          cassette_color:    metadata.color,
          card_bg:           metadata.cardBg,
          from_name:         metadata.senderName,
          note:              metadata.notes,
          recipient_name:    metadata.recipientName,
          address_line1:     metadata.addressLine1,
          address_line2:     metadata.addressLine2,
          city:              metadata.addressCity,
          state:             metadata.addressState,
          zip:               metadata.addressZip,
          customer_email:    metadata.customerEmail,
          postgrid_order_id: postcard.id,
          postgrid_status:   postcard.status,
        })
      } catch (dbErr) {
        console.error('Supabase insert failed:', dbErr.message)
      }
    } catch (err) {
      console.error('PostGrid failed:', err.message)
    }
  }

  res.json({ received: true })
})

// ── Validate YouTube URL ─────────────────────────────────────
app.get('/api/validate-youtube', youtubeLimiter, async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ valid: false, error: 'No URL provided' })

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return res.status(500).json({ valid: false, error: 'YouTube API key not configured' })

  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    const listId  = u.searchParams.get('list')
    const videoId = u.searchParams.get('v') || (u.hostname === 'youtu.be' ? u.pathname.slice(1) : null)

    if (listId) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${listId}&key=${apiKey}`)
      const d = await r.json()
      if (!d.items?.length) return res.json({ valid: false, error: 'Playlist not found or is private' })
      return res.json({ valid: true, type: 'playlist', title: d.items[0].snippet.title })
    }

    if (videoId) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
      const d = await r.json()
      if (!d.items?.length) return res.json({ valid: false, error: 'Video not found or is private' })
      return res.json({ valid: true, type: 'video', title: d.items[0].snippet.title })
    }

    res.json({ valid: false, error: 'Could not extract a playlist or video ID from this URL' })
  } catch {
    res.json({ valid: false, error: 'Invalid URL' })
  }
})

// Constant-time admin check. Returns false if the expected secret is unset/empty,
// so a missing env var can never silently become an auth bypass.
function adminOk(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string' || !provided || !expected) return false
  const a = crypto.createHash('sha256').update(provided).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

// ── Retry PostGrid for a specific payment intent ─────────────
// POST /api/retry-order  { "paymentIntentId": "pi_...", "adminSecret": "..." }
app.post('/api/retry-order', async (req, res) => {
  const { paymentIntentId, adminSecret, addressOverride } = req.body
  if (!adminOk(adminSecret, process.env.ADMIN_SECRET)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!paymentIntentId) {
    return res.status(400).json({ error: 'paymentIntentId required' })
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (pi.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment status is ${pi.status}, not succeeded` })
    }
    const metadata = addressOverride
      ? { ...pi.metadata, ...addressOverride }
      : pi.metadata
    const result = await sendPostcard(metadata)
    res.json({ success: true, postcard: result })
  } catch (err) {
    console.error('retry-order error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Verify a PostGrid webhook JWT (HS256, signed with the webhook's secret) and
// return its decoded payload, or null if the signature is missing/invalid.
function verifyPostgridJwt(token, secret) {
  if (!token || !secret) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, sig] = parts
  const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null
  try { return JSON.parse(Buffer.from(p, 'base64url').toString('utf8')) } catch { return null }
}

// ── PostGrid Webhook ─────────────────────────────────────────
// PostGrid sends a signed JWT (payloadFormat: jwt). Verify it before trusting.
app.post('/api/postgrid-webhook', async (req, res) => {
  const secret = process.env.POSTGRID_WEBHOOK_SECRET
  if (!secret) {
    console.error('POSTGRID_WEBHOOK_SECRET not set — rejecting webhook')
    return res.status(500).send('Webhook not configured')
  }
  const event = verifyPostgridJwt(req.body?.toString('utf8').trim(), secret)
  if (!event) return res.status(401).send('Invalid signature')

  console.log('PostGrid webhook received:', JSON.stringify(event).slice(0, 300))

  // PostGrid event shape: { type: 'postcard.updated', data: { object: { id, status, ... } } }
  // Also handle flat shape just in case: { id, status }
  const obj      = event?.data?.object ?? event?.data ?? event
  const postcardId = obj?.id
  const status     = (obj?.status || '').toLowerCase()

  if (!postcardId) {
    return res.status(200).json({ ignored: true, reason: 'no postcard id' })
  }

  // Update Supabase status
  const { data: rows, error: fetchErr } = await supabase
    .from('orders')
    .select('*')
    .eq('postgrid_order_id', postcardId)
    .limit(1)

  if (fetchErr) {
    console.error('Supabase fetch error on PostGrid webhook:', fetchErr.message)
    return res.status(200).json({ received: true })
  }

  const order = rows?.[0]

  if (order) {
    await supabase
      .from('orders')
      .update({ postgrid_status: status })
      .eq('postgrid_order_id', postcardId)

    if (status === 'mailed' && order.customer_email) {
      try {
        await sendMailedEmail({
          to:            order.customer_email,
          recipientName: order.recipient_name,
          senderName:    order.from_name,
          label:         order.cassette_label,
        })
        console.log('Mailed email sent to:', order.customer_email)
      } catch (emailErr) {
        console.error('Resend email failed:', emailErr.message)
      }
    }
  } else {
    console.warn('PostGrid webhook: no Supabase order found for postcardId:', postcardId)
  }

  res.json({ received: true })
})

// ── GET /api/health ──────────────────────────────────────────
// Runs a trivial DB query so the free-tier Supabase project registers activity
// and doesn't auto-pause after 7 days idle. Pinged daily by a scheduled job.
app.get('/api/health', async (req, res) => {
  try {
    const { error } = await supabase.from('orders').select('stripe_payment_id').limit(1)
    res.json({ ok: !error, db: error ? 'down' : 'up' })
  } catch {
    res.status(500).json({ ok: false, db: 'down' })
  }
})

// ── Admin: all orders from Supabase ─────────────────────────
app.get('/api/admin/orders', async (req, res) => {
  if (!adminOk(req.headers['x-admin-password'], process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

if (process.env.VERCEL !== '1') {
  const server = app.listen(port, () => {
    console.log(`Tape Deck server running on http://localhost:${port}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Kill the old process and restart.`)
    } else {
      console.error('Server error:', err.message)
    }
    process.exit(1)
  })
}

export default app
