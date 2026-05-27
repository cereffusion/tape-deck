import QRCode from 'qrcode'
import { generateFrontHtml, generateBackHtml } from './card-html.js'

const POSTGRID_API = 'https://api.postgrid.com/print-mail/v1'

const FROM_ADDRESS = {
  firstName:       'Tape',
  lastName:        'Deck',
  addressLine1:    '123 Cassette Lane',
  city:            'San Francisco',
  provinceOrState: 'CA',
  postalOrZip:     '94107',
  countryCode:     'US',
}

export async function sendPostcard(metadata) {
  const {
    label, youtubeUrl, color, notes,
    recipientName,
    addressLine1, addressLine2,
    addressCity, addressState, addressZip, addressCountry,
  } = metadata

  // Generate QR code as base64 PNG
  const qrDataUrl = await QRCode.toDataURL(youtubeUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#111111', light: '#ffffff' },
  })

  const frontHtml = generateFrontHtml(label, color)
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
    notes || ''
  )

  // Split recipient name into first/last
  const nameParts = (recipientName || '').trim().split(/\s+/)
  const firstName = nameParts[0] || 'Friend'
  const lastName  = nameParts.slice(1).join(' ') || '.'

  const body = {
    size:      '6x4',
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
    from: FROM_ADDRESS,
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
