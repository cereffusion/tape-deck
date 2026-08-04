import QRCode from 'qrcode'
import { generateFrontHtml, generateBackHtml } from './card-html.js'

const POSTGRID_API = 'https://api.postgrid.com/print-mail/v1'

const FROM_ADDRESS = {
  firstName:       'Mail-a-Mix',
  lastName:        '',
  addressLine1:    '5504 13th Ave Unit #214',
  city:            'Brooklyn',
  provinceOrState: 'NY',
  postalOrZip:     '11219',
  countryCode:     'US',
}

export async function sendPostcard(metadata) {
  const {
    label, youtubeUrl, color, cardBg, notes, senderName, cassetteId, orderNum,
    recipientName,
    addressLine1, addressLine2,
    addressCity, addressState, addressZip, addressCountry,
    senderLine1, senderLine2, senderCity, senderState, senderZip, senderCountry,
  } = metadata

  // Generate QR code as base64 PNG
  const qrDataUrl = await QRCode.toDataURL(youtubeUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#111111', light: '#ffffff' },
  })

  const frontHtml = generateFrontHtml(label, color, cassetteId, orderNum, cardBg)
  const backHtml  = generateBackHtml(
    recipientName,
    {
      line1:   addressLine1,
      line2:   addressLine2,
      city:    addressCity,
      state:   addressState,
      zip:     addressZip,
      country: addressCountry || 'US',
    },
    qrDataUrl,
    notes || '',
    senderName || ''
  )

  // Split recipient name into first/last
  const nameParts = (recipientName || '').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Friend'
  const lastName  = nameParts.slice(1).join(' ') || '.'

  const body = {
    size:             '6x4',
    addressStrictness: 'none',
    frontHTML: frontHtml,
    backHTML:  backHtml,
    to: {
      firstName,
      lastName,
      addressLine1:    addressLine1,
      addressLine2:    addressLine2 || undefined,
      city:            addressCity,
      provinceOrState: addressState,
      postalOrZip:     addressZip,
      countryCode:     addressCountry || 'US',
    },
    from: senderLine1
      ? {
          firstName:       (senderName || 'Friend').split(' ')[0],
          lastName:        (senderName || '').split(' ').slice(1).join(' ') || '.',
          addressLine1:    senderLine1,
          addressLine2:    senderLine2 || undefined,
          city:            senderCity,
          provinceOrState: senderState,
          postalOrZip:     senderZip,
          countryCode:     senderCountry || 'US',
        }
      : FROM_ADDRESS,
  }

  console.log('Sending to PostGrid — frontHTML length:', frontHtml.length, '| first 100 chars:', frontHtml.slice(0, 100))

  const res = await fetch(`${POSTGRID_API}/postcards`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    process.env.POSTGRID_API_KEY,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`PostGrid error: ${JSON.stringify(data)}`)
  }

  console.log('PostGrid postcard created:', data.id, '| status:', data.status)
  return data
}

// Sigil Forge orders: pre-rendered front/back HTML, always from the house address.
export async function sendSigilPostcard({ frontHtml, backHtml, recipientName, address }) {
  const nameParts = (recipientName || '').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Friend'
  const lastName  = nameParts.slice(1).join(' ') || '.'

  const res = await fetch(`${POSTGRID_API}/postcards`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    process.env.POSTGRID_API_KEY,
    },
    body: JSON.stringify({
      size:              '6x4',
      addressStrictness: 'none',
      frontHTML: frontHtml,
      backHTML:  backHtml,
      to: {
        firstName,
        lastName,
        addressLine1:    address.line1,
        addressLine2:    address.line2 || undefined,
        city:            address.city,
        provinceOrState: address.state,
        postalOrZip:     address.zip,
        countryCode:     address.country || 'US',
      },
      from: FROM_ADDRESS,
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`PostGrid error: ${JSON.stringify(data)}`)
  console.log('PostGrid sigil postcard created:', data.id, '| status:', data.status)
  return data
}
