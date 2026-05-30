import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMailedEmail({ to, recipientName, senderName, label }) {
  const displayRecipient = recipientName || 'your recipient'
  const displaySender    = senderName    || 'someone special'
  const displayLabel     = label         || 'your mixtape'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your card is on its way</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <div style="font-size:26px;font-weight:bold;letter-spacing:0.12em;color:#f0a020;font-family:'Courier New',Courier,monospace;">
                MAIL&#8209;A&#8209;MIX
              </div>
              <div style="font-size:11px;letter-spacing:0.22em;color:#666;margin-top:4px;text-transform:uppercase;">
                Side A &nbsp;·&nbsp; 90 Min &nbsp;·&nbsp; Hi-Fi
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:36px 40px;">

              <!-- Cassette icon -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;background:#111;border:1px solid #333;border-radius:4px;padding:12px 28px;font-size:22px;letter-spacing:0.18em;color:#f0a020;">
                  ▶ ◼
                </div>
              </div>

              <p style="margin:0 0 8px 0;font-size:13px;letter-spacing:0.08em;color:#888;text-transform:uppercase;">
                Your card shipped
              </p>
              <h1 style="margin:0 0 24px 0;font-size:22px;color:#f0e0c0;letter-spacing:0.04em;line-height:1.3;font-weight:normal;">
                &ldquo;${escapeHtml(displayLabel)}&rdquo; is on its way.
              </h1>

              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.7;color:#b0a090;">
                ${escapeHtml(displayRecipient)} should receive the card in
                <strong style="color:#f0e0c0;">3&ndash;5 business days</strong>.
                When it arrives, they can scan the QR code on the back to play your playlist.
              </p>

              <div style="border-top:1px solid #2a2a2a;margin:28px 0;"></div>

              <p style="margin:0;font-size:12px;line-height:1.6;color:#665544;">
                Sent by ${escapeHtml(displaySender)} via Mail-A-Mix &mdash; real postcard, real stamp, real feels.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#444;letter-spacing:0.1em;">
                MAILAMIX.COM &nbsp;·&nbsp; BROOKLYN, NY
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const { data, error } = await resend.emails.send({
    from:    'Mail-A-Mix <hello@mailamix.com>',
    to,
    subject: `Your mixtape card is on its way ▶`,
    html,
  })

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`)
  return data
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
