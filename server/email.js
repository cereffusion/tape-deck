import { Resend } from 'resend'

// Lazy-init so a missing RESEND_API_KEY doesn't throw at import time and crash
// the entire serverless function — it should only degrade email, not the app.
let _resend
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

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

  const { data, error } = await getResend().emails.send({
    from:    'Mail-A-Mix <hello@mailamix.com>',
    to,
    subject: `Your mixtape card is on its way ▶`,
    html,
  })

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`)
  return data
}

export async function sendSigilMailedEmail({ to, recipientName }) {
  const displayRecipient = recipientName || 'Your recipient'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your sigil is on its way</title>
</head>
<body style="margin:0;padding:0;background:#0b0a10;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0a10;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <div style="font-size:22px;letter-spacing:0.35em;color:#c9a84c;text-transform:uppercase;">
                Sigil Forge
              </div>
              <div style="font-size:11px;letter-spacing:0.22em;color:#6f6a7e;margin-top:6px;font-style:italic;">
                speak your intent, receive its mark
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#15131e;border:1px solid #2c2840;border-radius:8px;padding:36px 40px;">

              <div style="text-align:center;margin-bottom:26px;font-size:26px;color:#c9a84c;">
                &#10022;
              </div>

              <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.22em;color:#6f6a7e;text-transform:uppercase;text-align:center;">
                The mark has been sent
              </p>
              <h1 style="margin:0 0 24px 0;font-size:21px;color:#e8e2d0;letter-spacing:0.04em;line-height:1.4;font-weight:normal;text-align:center;">
                Your sigil is on its way.
              </h1>

              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.75;color:#a89e8c;">
                ${escapeHtml(displayRecipient)} should receive the card in
                <strong style="color:#e8e2d0;font-weight:normal;">3&ndash;5 business days</strong> &mdash;
                a real postcard, the mark on the front, your note on the back.
                The intention it carries stays unspoken, as it should.
              </p>

              <div style="border-top:1px dashed #2c2840;margin:26px 0;"></div>

              <p style="margin:0;font-size:12px;line-height:1.7;color:#6f6a7e;font-style:italic;">
                Forged &amp; mailed by Sigil Forge. Tell them to keep it somewhere it will be seen.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#3a3550;letter-spacing:0.18em;text-transform:uppercase;">
                Sigil Forge &nbsp;&#10022;&nbsp; Brooklyn, NY
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const { data, error } = await getResend().emails.send({
    from:    'Sigil Forge <hello@mailamix.com>',
    to,
    subject: `Your sigil is on its way ✦`,
    html,
  })

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`)
  return data
}

export async function sendGrimoireCodeEmail({ to, code }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Grimoire unlock code</title>
</head>
<body style="margin:0;padding:0;background:#0b0a10;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0a10;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <div style="font-size:22px;letter-spacing:0.35em;color:#c9a84c;text-transform:uppercase;">Sigil Forge</div>
              <div style="font-size:11px;letter-spacing:0.22em;color:#6f6a7e;margin-top:6px;font-style:italic;">the grimoire opens</div>
            </td>
          </tr>
          <tr>
            <td style="background:#15131e;border:1px solid #2c2840;border-radius:8px;padding:36px 40px;text-align:center;">
              <div style="font-size:26px;color:#c9a84c;margin-bottom:22px;">&#10022;</div>
              <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.22em;color:#6f6a7e;text-transform:uppercase;">Your unlock code</p>
              <div style="font-size:26px;letter-spacing:0.14em;color:#e8e2d0;background:#0b0a10;border:1px dashed #c9a84c;border-radius:6px;padding:16px 10px;margin:0 0 24px 0;font-family:'Courier New',monospace;">
                ${escapeHtml(code)}
              </div>
              <p style="margin:0;font-size:13px;line-height:1.75;color:#a89e8c;text-align:left;">
                Enter this code on the Sigil Forge site (or any device) under
                <strong style="color:#e8e2d0;font-weight:normal;">&ldquo;Already have a code?&rdquo;</strong>
                to open the Grimoire &mdash; effect inks, the servitor builder, and your sigil library.
                Keep this email; the code is your key.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:#3a3550;letter-spacing:0.18em;text-transform:uppercase;">Sigil Forge &nbsp;&#10022;&nbsp; Brooklyn, NY</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const { data, error } = await getResend().emails.send({
    from:    'Sigil Forge <hello@mailamix.com>',
    to,
    subject: `Your Grimoire unlock code ✦`,
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
