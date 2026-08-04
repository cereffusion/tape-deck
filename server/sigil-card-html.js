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

// Per PostGrid's US 6x4 design guideline (us_intl_postcard_6inx4in.pdf), the
// back reserves two no-ink regions that trigger "Content found overlapping
// address region" cancellations:
//   - Address & Indicia Zone: the ENTIRE right 40% (2.4in wide, full height)
//   - USPS Barcode Zone: bottom 4.75in x 0.625in strip
// At 864x576 (144dpi) that means: keep everything left of x=518 and above
// y=486. All content below sits in the left 60%, with margin to spare.
// PostGrid prints the recipient AND return address in the right zone itself,
// so the card art carries neither.
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
  /* Everything lives in this box: left of PostGrid's right-40% address zone
     (x < 518) and above the barcode strip (y < 486), with buffer. */
  .safe {
    position: absolute; top: 28px; left: 34px; width: 440px; height: 400px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .masthead {
    font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #8a7848;
    border-bottom: 1px dashed rgba(160,140,90,0.5); padding-bottom: 10px;
  }
  .from-line { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a7848; }
  .from-line b { display: block; color: #2a2010; font-weight: normal; font-size: 16px; letter-spacing: 0.08em; text-transform: none; margin-top: 4px; }
  .note-label { font-size: 8.5px; letter-spacing: 0.24em; text-transform: uppercase; color: #8a7848; margin-bottom: 7px; }
  .note-text { font-size: 12.5px; line-height: 1.6; color: #2a2010; font-style: italic; white-space: pre-wrap; }
  .note-lines { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
  .note-line { height: 1px; background: repeating-linear-gradient(90deg, #b8a878 0px, #b8a878 4px, transparent 4px, transparent 8px); opacity: 0.5; }
  .footer-row { margin-top: auto; display: flex; align-items: flex-end; gap: 16px; }
  .keep-note { flex: 1; font-size: 9px; color: #a08c58; font-style: italic; line-height: 1.6; }
  .cancel-mark {
    width: 74px; height: 74px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid rgba(138,120,72,0.4);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    transform: rotate(-11deg); opacity: 0.6;
  }
  .cancel-mark .t { font-size: 7.5px; letter-spacing: 0.14em; color: rgba(138,120,72,0.8); text-transform: uppercase; }
  .cancel-mark .m { font-size: 14px; color: rgba(138,120,72,0.85); margin: 2px 0; }
</style>
</head>
<body>
<div class="card-back">
  <div class="safe">
    <div class="masthead">&#10022; A Sigil, Forged &amp; Sent</div>

    <div class="from-line">Forged for you by <b>${escapeHtml(senderName || 'someone who holds you in mind')}</b></div>

    <div>
      <div class="note-label">A note &mdash;</div>
      ${note
        ? `<div class="note-text">${escapeHtml(note)}</div>`
        : `<div class="note-lines"><div class="note-line"></div><div class="note-line"></div><div class="note-line"></div></div>`
      }
    </div>

    <div class="footer-row">
      <div class="keep-note">The mark on the front carries an intention set for you.
Keep it somewhere it will be seen &mdash; a mirror, a wall, a wallet &mdash; and let it work.</div>
      <div class="cancel-mark"><div class="t">Sigil Forge</div><div class="m">&#10022;</div><div class="t">Charged</div></div>
    </div>
  </div>
</div>
</body>
</html>`
}
