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

// All content is confined to the top ~45% of the card. PostGrid reserves the
// lower region of the back for the USPS address label and cancels any order
// whose artwork overlaps it ("Content found overlapping address region") —
// so the bottom stays completely blank and PostGrid prints the recipient
// address itself. No recipient block of our own.
export function generateSigilBackHtml({ note, senderName }) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 864px; height: 576px; overflow: hidden; }
  body { font-family: Georgia, 'Times New Roman', serif; }
  .card-back {
    width: 864px; height: 576px; position: relative;
    background: radial-gradient(ellipse at 50% 50%, #fdf6e5 0%, #f4ebd5 100%);
  }
  .masthead {
    position: absolute; top: 18px; left: 0; right: 0; text-align: center;
    font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #8a7848;
  }
  .content {
    position: absolute; top: 46px; left: 0; right: 0; height: 214px;
    display: flex;
  }
  .content::after {
    content: ''; position: absolute; top: 4px; bottom: 0; left: 58%; width: 1px;
    background: repeating-linear-gradient(180deg, #b8a878 0px, #b8a878 2px, transparent 2px, transparent 5px);
  }
  .col-left {
    width: 58%; padding: 6px 30px 0 34px;
    display: flex; flex-direction: column; gap: 14px;
  }
  .from-line { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a7848;
    border-bottom: 1px dashed rgba(160,140,90,0.5); padding-bottom: 7px; }
  .from-line b { color: #2a2010; font-weight: normal; font-size: 14px; letter-spacing: 0.08em; text-transform: none; }
  .note-label { font-size: 8.5px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a7848; margin-bottom: 6px; }
  .note-text { font-size: 12px; line-height: 1.55; color: #2a2010; font-style: italic; white-space: pre-wrap; }
  .note-lines { display: flex; flex-direction: column; gap: 15px; padding-top: 4px; }
  .note-line { height: 1px; background: repeating-linear-gradient(90deg, #b8a878 0px, #b8a878 4px, transparent 4px, transparent 8px); opacity: 0.5; }
  .col-right {
    width: 42%; padding: 6px 110px 0 26px;
    display: flex; flex-direction: column; gap: 16px;
  }
  .cancel-mark {
    position: absolute; top: 6px; right: 20px;
    width: 78px; height: 78px; border-radius: 50%;
    border: 1.5px solid rgba(138,120,72,0.4);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    transform: rotate(-11deg); opacity: 0.6;
  }
  .cancel-mark .t { font-size: 8px; letter-spacing: 0.16em; color: rgba(138,120,72,0.8); text-transform: uppercase; }
  .cancel-mark .m { font-size: 15px; color: rgba(138,120,72,0.85); margin: 2px 0; }
  .return-label { font-size: 8px; letter-spacing: 0.24em; color: #a08c58; text-transform: uppercase; margin-bottom: 4px; }
  .return-address { font-size: 9.5px; color: #6a5a36; line-height: 1.6; }
  .keep-note { font-size: 9px; color: #a08c58; font-style: italic; line-height: 1.55; }
</style>
</head>
<body>
<div class="card-back">
  <div class="masthead">&#10022; A Sigil, Forged &amp; Sent &#10022;</div>

  <div class="content">
    <div class="col-left">
      <div class="from-line">Forged for you by <b>${escapeHtml(senderName || 'someone who holds you in mind')}</b></div>
      <div>
        <div class="note-label">A note &mdash;</div>
        ${note
          ? `<div class="note-text">${escapeHtml(note)}</div>`
          : `<div class="note-lines"><div class="note-line"></div><div class="note-line"></div><div class="note-line"></div></div>`
        }
      </div>
    </div>

    <div class="col-right">
      <div class="cancel-mark"><div class="t">Sigil Forge</div><div class="m">&#10022;</div><div class="t">Charged</div></div>
      <div>
        <div class="return-label">From</div>
        <div class="return-address">Mail-a-Mix<br>5504 13th Ave, Unit #214<br>Brooklyn, NY 11219</div>
      </div>
      <div class="keep-note">The mark on the front carries an intention.
Keep it somewhere it will be seen.</div>
    </div>
  </div>
</div>
</body>
</html>`
}
