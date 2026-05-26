import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { sendPostcard } from './postgrid.js'

const app  = express()
const port = process.env.PORT || 3001

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY is not set in .env')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

// ── Create PaymentIntent ─────────────────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
  const { label, youtubeUrl, color, recipientName, address } = req.body

  if (!label || !youtubeUrl || !recipientName) {
    return res.status(400).json({ error: 'Missing required order fields' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   500,
      currency: 'usd',
      metadata: {
        label, youtubeUrl, color, recipientName,
        addressLine1:   address?.line1   || '',
        addressLine2:   address?.line2   || '',
        addressCity:    address?.city    || '',
        addressState:   address?.state   || '',
        addressZip:     address?.zip     || '',
        addressCountry: address?.country || 'US',
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
    const metadata = event.data.object.metadata
    console.log('Payment succeeded — firing PostGrid for:', metadata.label)
    try {
      await sendPostcard(metadata)
    } catch (err) {
      console.error('PostGrid failed:', err.message)
    }
  }

  res.json({ received: true })
})

// ── Test endpoint: fire PostGrid without webhook ─────────────
// Use this during dev: POST /api/test-send with the order body
app.post('/api/test-send', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' })
  }

  const { label, youtubeUrl, color, recipientName, address } = req.body
  try {
    const result = await sendPostcard({
      label, youtubeUrl, color, recipientName,
      addressLine1:   address?.line1   || '',
      addressLine2:   address?.line2   || '',
      addressCity:    address?.city    || '',
      addressState:   address?.state   || '',
      addressZip:     address?.zip     || '',
      addressCountry: address?.country || 'US',
    })
    res.json({ success: true, postcard: result })
  } catch (err) {
    console.error('Test send error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Minimal PostGrid connectivity test ──────────────────────
app.post('/api/test-postgrid-minimal', async (req, res) => {
  try {
    const response = await fetch('https://api.postgrid.com/print-mail/v1/postcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.POSTGRID_API_KEY,
      },
      body: JSON.stringify({
        size: '6x4',
        frontHTML: '<html><body style="background:black;color:white;"><h1>Hello</h1></body></html>',
        backHTML:  '<html><body><p>Back of card</p></body></html>',
        to: {
          firstName:       'Jake',
          lastName:        'Morrison',
          addressLine1:    '456 Main St',
          city:            'Brooklyn',
          provinceOrState: 'NY',
          postalOrZip:     '11201',
          countryCode:     'US',
        },
        from: {
          firstName:       'Tape',
          lastName:        'Deck',
          addressLine1:    '123 Cassette Lane',
          city:            'San Francisco',
          provinceOrState: 'CA',
          postalOrZip:     '94107',
          countryCode:     'US',
        },
      }),
    })
    const data = await response.json()
    console.log('PostGrid minimal test response:', JSON.stringify(data).slice(0, 300))
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
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
