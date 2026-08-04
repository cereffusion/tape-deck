// Print templates for mailed sigil postcards (Sigil Forge orders).
// 6x4" at 144dpi = 864x576, same geometry as the mixtape cards.

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// The sigil SVG arrives from the client. It is rendered by PostGrid's HTML
// renderer, never by our own pages, but strip active content anyway.
export function sanitizeSvg(svg) {
  if (typeof svg !== 'string') return null
  if (svg.length > 300_000) return null
  if (!/^\s*<svg[\s>]/i.test(svg)) return null
  const lowered = svg.toLowerCase()
  if (lowered.includes('<script') || lowered.includes('javascript:') || /\son\w+\s*=/.test(lowered)) return null
  if (lowered.includes('<foreignobject') || lowered.includes('<iframe') || lowered.includes('href=')) return null
  return svg
}

export function generateSigilFrontHtml(svg) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 864px; height: 576px; overflow: hidden; }
  .card-front {
    width: 864px; height: 576px; position: relative;
    background: radial-gradient(ellipse at 50% 38%, #181425 0%, #0b0a10 72%);
    display: flex; align-items: center; justify-content: center;
  }
  .sigil-wrap { width: 470px; height: 470px; }
  .sigil-wrap svg { width: 100%; height: 100%; display: block; }
  .wordmark {
    position: absolute; bottom: 26px; left: 0; right: 0;
    text-align: center;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(201,168,76,0.55);
  }
</style>
</head>
<body>
<div class="card-front">
  <div class="sigil-wrap">${svg}</div>
  <div class="wordmark">Sigil Forge</div>
</div>
</body>
</html>`
}

export function generateSigilBackHtml({ note, senderName, recipientName, address }) {
  const addrLine = [address.city, address.state, address.zip].filter(Boolean).join(', ')
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 864px; height: 576px; overflow: hidden; }
  body { font-family: Georgia, 'Times New Roman', serif; }
  .card-back {
    width: 864px; height: 576px; display: flex; position: relative;
    background: radial-gradient(ellipse at 50% 50%, #fdf6e5 0%, #f4ebd5 100%);
  }
  .card-back::after {
    content: ''; position: absolute; top: 50px; bottom: 50px; left: 50%; width: 1px;
    background: repeating-linear-gradient(180deg, #b8a878 0px, #b8a878 2px, transparent 2px, transparent 5px);
  }
  .masthead {
    position: absolute; top: 20px; left: 0; right: 0; text-align: center;
    font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #8a7848;
  }
  .col-left {
    width: 50%; padding: 56px 34px 30px;
    display: flex; flex-direction: column; justify-content: flex-start; gap: 22px;
    position: relative; z-index: 1;
  }
  .from-line { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a7848;
    border-bottom: 1px dashed rgba(160,140,90,0.5); padding-bottom: 8px; }
  .from-line b { color: #2a2010; font-weight: normal; font-size: 15px; letter-spacing: 0.08em; text-transform: none; }
  .note-label { font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a7848; margin-bottom: 8px; }
  .note-text { font-size: 13px; line-height: 1.65; color: #2a2010; font-style: italic; white-space: pre-wrap; }
  .note-lines { display: flex; flex-direction: column; gap: 16px; }
  .note-line { height: 1px; background: repeating-linear-gradient(90deg, #b8a878 0px, #b8a878 4px, transparent 4px, transparent 8px); opacity: 0.5; }
  .keep-note { font-size: 9.5px; color: #a08c58; font-style: italic; line-height: 1.6; }
  .col-right {
    width: 50%; padding: 56px 36px 30px;
    display: flex; flex-direction: column; justify-content: flex-start; gap: 30px;
    position: relative; z-index: 1;
  }
  .cancel-mark {
    position: absolute; top: 30px; right: 24px;
    width: 82px; height: 82px; border-radius: 50%;
    border: 1.5px solid rgba(138,120,72,0.4);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    transform: rotate(-11deg); opacity: 0.6;
  }
  .cancel-mark .t { font-size: 8px; letter-spacing: 0.16em; color: rgba(138,120,72,0.8); text-transform: uppercase; }
  .cancel-mark .m { font-size: 15px; color: rgba(138,120,72,0.85); margin: 2px 0; }
  .return-label { font-size: 8px; letter-spacing: 0.24em; color: #a08c58; text-transform: uppercase; margin-bottom: 4px; }
  .return-address { font-size: 10px; color: #6a5a36; line-height: 1.7; }
  .recipient-block { padding: 12px 16px; border-left: 3px solid #8a7848; margin-right: 8px; }
  .to-label { font-size: 9px; letter-spacing: 0.24em; color: #8a7848; text-transform: uppercase; margin-bottom: 6px; }
  .recipient-name { font-size: 16px; color: #1a1408; margin-bottom: 4px; }
  .recipient-address { font-size: 12px; color: #2a2010; line-height: 1.7; }
</style>
</head>
<body>
<div class="card-back">
  <div class="masthead">&#10022; A Sigil, Forged &amp; Sent &#10022;</div>

  <div class="col-left">
    <div class="from-line">Forged for you by <b>${escapeHtml(senderName || 'someone who holds you in mind')}</b></div>

    <div>
      <div class="note-label">A note &mdash;</div>
      ${note
        ? `<div class="note-text">${escapeHtml(note)}</div>`
        : `<div class="note-lines"><div class="note-line"></div><div class="note-line"></div><div class="note-line"></div></div>`
      }
    </div>

    <div class="keep-note">The mark on the front carries an intention set for you.
Keep it somewhere it will be seen &mdash; a mirror, a wall, a wallet &mdash; and let it work.</div>
  </div>

  <div class="col-right">
    <div class="cancel-mark"><div class="t">Sigil Forge</div><div class="m">&#10022;</div><div class="t">Charged</div></div>

    <div>
      <div class="return-label">From</div>
      <div class="return-address">Mail-a-Mix<br>5504 13th Ave<br>Unit #214<br>Brooklyn, NY 11219</div>
    </div>

    <div class="recipient-block">
      <div class="to-label">&#9654; Deliver to</div>
      <div class="recipient-name">${escapeHtml(recipientName)}</div>
      <div class="recipient-address">
        ${escapeHtml(address.line1 || '')}${address.line2 ? '<br>' + escapeHtml(address.line2) : ''}<br>
        ${escapeHtml(addrLine)}
      </div>
    </div>
  </div>
</div>
</body>
</html>`
}
