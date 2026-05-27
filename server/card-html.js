// Generates self-contained front/back HTML for PostGrid print rendering.
// All CSS is inlined — no external stylesheets except Google Fonts.

const COLORS = {
  black: {
    body:         '#1c1c1c',
    bodyDark:     '#0a0a0a',
    bodyLight:    '#2e2e2e',
    shellEdge:    '#050505',
    labelBg:      '#f4e4bc',
    labelBg2:     '#ead49a',
    labelTxt:     '#2a1810',
    labelStripe:  '#c64a08',
    labelStripe2: '#1c1208',
    labelAccent:  '#d97520',
    reelBg:       '#2a2a2a',
    reelHub:      '#4a4a4a',
    reelTeeth:    '#1a1a1a',
    screwColor:   '#2a2a2a',
    screwDark:    '#0a0a0a',
    tapeColor:    '#0c0604',
    tapeWound:    '#3a1a08',
    shellText:    'rgba(255,200,140,0.12)',
  },
  cream: {
    body:         '#ebd6a6',
    bodyDark:     '#b89860',
    bodyLight:    '#f4e2b8',
    shellEdge:    '#8a6830',
    labelBg:      '#fff8e0',
    labelBg2:     '#f4e8c0',
    labelTxt:     '#2a1400',
    labelStripe:  '#8a3000',
    labelStripe2: '#2a1400',
    labelAccent:  '#c84a08',
    reelBg:       '#b89860',
    reelHub:      '#8a6830',
    reelTeeth:    '#6a4820',
    screwColor:   '#9a7838',
    screwDark:    '#4a3010',
    tapeColor:    '#1c0a04',
    tapeWound:    '#4a1c08',
    shellText:    'rgba(80,40,10,0.35)',
  },
  orange: {
    body:         '#c64a08',
    bodyDark:     '#6a2400',
    bodyLight:    '#e85d04',
    shellEdge:    '#4a1800',
    labelBg:      '#fff4e0',
    labelBg2:     '#f4dcb0',
    labelTxt:     '#2a0800',
    labelStripe:  '#2a0800',
    labelStripe2: '#f0a020',
    labelAccent:  '#c64a08',
    reelBg:       '#4a1800',
    reelHub:      '#6a2400',
    reelTeeth:    '#2a0800',
    screwColor:   '#6a2400',
    screwDark:    '#2a0800',
    tapeColor:    '#0c0604',
    tapeWound:    '#3a1a08',
    shellText:    'rgba(255,220,160,0.22)',
  },
  blue: {
    body:         '#1a3a7a',
    bodyDark:     '#0a1840',
    bodyLight:    '#2a5aa8',
    shellEdge:    '#050d28',
    labelBg:      '#f0f0e8',
    labelBg2:     '#d8d8c8',
    labelTxt:     '#0a1428',
    labelStripe:  '#0a1428',
    labelStripe2: '#d4500c',
    labelAccent:  '#d4500c',
    reelBg:       '#0a1840',
    reelHub:      '#1a3a7a',
    reelTeeth:    '#050d28',
    screwColor:   '#0e2255',
    screwDark:    '#050d28',
    tapeColor:    '#050818',
    tapeWound:    '#1a1a1a',
    shellText:    'rgba(200,220,255,0.18)',
  },
}

function getLabelFontSize(text) {
  const len = (text || '').length
  if (len > 32) return '28px'
  if (len > 24) return '33px'
  if (len > 18) return '38px'
  return '44px'
}

export function generateFrontHtml(label, color) {
  const c = COLORS[color] || COLORS.black

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 864px; height: 576px; overflow: hidden; }

  .card-front {
    width: 864px; height: 576px;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #1c1208 0%, #120a04 100%);
  }

  .front-frame {
    position: absolute; inset: 22px;
    border: 1px dashed rgba(240,160,32,0.12);
    border-radius: 2px;
    pointer-events: none;
  }

  .front-stock {
    position: absolute; top: 30px; left: 36px;
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 0.3em;
    color: rgba(240,160,32,0.28); text-transform: uppercase;
  }
  .front-cat {
    position: absolute; top: 30px; right: 36px;
    font-family: 'Space Mono', monospace;
    font-size: 8px; letter-spacing: 0.3em;
    color: rgba(240,160,32,0.28); text-transform: uppercase;
  }
  .front-brand {
    position: absolute; bottom: 22px; left: 0; right: 0;
    text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px; letter-spacing: 0.55em;
    color: rgba(240,160,32,0.42);
    padding-left: 0.55em;
  }

  .cassette-wrap {
    position: relative;
    transform: rotate(-1.2deg);
  }

  .cassette {
    position: relative; width: 540px; height: 340px;
    border-radius: 8px;
    padding: 14px 22px 12px;
    display: flex; flex-direction: column; align-items: center;
    background: linear-gradient(170deg, ${c.bodyLight} 0%, ${c.body} 35%, ${c.bodyDark} 100%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -2px 0 rgba(0,0,0,0.6),
      0 0 0 1px ${c.shellEdge};
  }

  .cassette-top {
    position: relative; width: 100%; height: 14px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .shell-brand-top {
    font-family: 'Bebas Neue', sans-serif; font-size: 8px;
    letter-spacing: 0.4em; color: ${c.shellText}; padding-left: 0.4em;
  }

  .screw {
    width: 11px; height: 11px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, ${c.screwColor} 0%, ${c.screwDark} 80%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 0 0 1px rgba(0,0,0,0.4);
    flex-shrink: 0;
  }

  .label-well {
    width: calc(100% - 32px); padding: 4px;
    margin: 6px 0 4px;
    background: ${c.shellEdge}; border-radius: 4px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.7);
    flex-shrink: 0;
  }
  .cassette-label {
    width: 100%; height: 86px;
    background: linear-gradient(180deg, ${c.labelBg} 0%, ${c.labelBg2} 100%);
    border-radius: 2px;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .label-header {
    height: 18px; background: ${c.labelStripe};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 10px; flex-shrink: 0;
  }
  .label-brand {
    font-family: 'Bebas Neue', sans-serif; font-size: 10px;
    letter-spacing: 0.26em; color: ${c.labelBg};
  }
  .label-cat {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.16em; color: ${c.labelBg}; opacity: 0.85;
  }
  .label-body {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 4px 18px 2px; gap: 2px;
  }
  .label-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: ${getLabelFontSize(label)};
    letter-spacing: 0.06em; color: ${c.labelTxt};
    text-align: center; line-height: 1;
    max-width: 100%; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    text-shadow: 0.6px 0.6px 0 ${c.labelAccent};
  }
  .label-sub {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.18em; color: ${c.labelStripe};
    text-transform: uppercase; opacity: 0.85;
    display: flex; align-items: center; gap: 8px;
  }
  .label-footer {
    height: 8px;
    background: repeating-linear-gradient(90deg,
      ${c.labelStripe2} 0px, ${c.labelStripe2} 6px,
      ${c.labelBg2} 6px, ${c.labelBg2} 8px);
    opacity: 0.7; flex-shrink: 0;
  }

  .cassette-window {
    width: calc(100% - 36px); height: 142px;
    background: ${c.tapeColor}; border-radius: 4px;
    position: relative;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 30px;
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.85);
    flex-shrink: 0; overflow: hidden;
  }

  .reel {
    width: 92px; height: 92px; border-radius: 50%;
    background: radial-gradient(circle at 50% 50%,
      ${c.reelHub} 0%, ${c.reelHub} 18%,
      ${c.reelBg} 19%, ${c.reelBg} 26%,
      ${c.tapeWound} 27%, #1a0c04 80%,
      ${c.reelTeeth} 81%, ${c.reelTeeth} 100%);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 0 1.5px rgba(0,0,0,0.7);
  }
  .reel-hub {
    width: 34px; height: 34px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, ${c.reelHub} 0%, ${c.reelTeeth} 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .reel-center {
    width: 13px; height: 13px; border-radius: 50%;
    background: ${c.tapeColor};
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.9);
  }

  .tape-strand {
    position: absolute; bottom: 26px; left: 70px; right: 70px;
    height: 5px;
    background: linear-gradient(to right,
      transparent 0%, rgba(80,40,10,0.65) 5%,
      ${c.tapeWound} 50%, rgba(80,40,10,0.65) 95%, transparent 100%);
    border-radius: 1px;
  }

  .cassette-bottom {
    width: 100%; height: 32px;
    display: grid; grid-template-columns: auto 1fr auto;
    align-items: center; gap: 14px;
    padding: 6px 4px 0; flex-shrink: 0;
  }
  .bottom-side { display: flex; align-items: center; gap: 10px; }
  .pin-cluster {
    display: flex; gap: 6px; align-items: center; justify-content: center;
    padding: 4px 14px; border-radius: 3px;
    background: ${c.shellEdge};
  }
  .pin-hole {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(0,0,0,0.6);
  }
  .pin-hole-big { width: 7px; height: 7px; }
  .shell-spec {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.2em; color: ${c.shellText};
    text-transform: uppercase; white-space: nowrap; line-height: 1.3;
  }
  .shell-spec-right { text-align: right; }
</style>
</head>
<body>
<div class="card-front">
  <div class="front-frame"></div>
  <div class="front-stock">CHROME · TYPE II</div>
  <div class="front-cat">TD-0420</div>

  <div class="cassette-wrap">
    <div class="cassette">
      <div class="cassette-top">
        <div class="screw"></div>
        <div class="shell-brand-top">TAPE DECK</div>
        <div class="screw"></div>
      </div>

      <div class="label-well">
        <div class="cassette-label">
          <div class="label-header">
            <div class="label-brand">TAPE · DECK</div>
            <div class="label-cat">C-90 · NO. 0420</div>
          </div>
          <div class="label-body">
            <div class="label-title">${escapeHtml(label || 'Your Tape')}</div>
            <div class="label-sub">Side A &nbsp;·&nbsp; 90 Min &nbsp;·&nbsp; Hi-Fi</div>
          </div>
          <div class="label-footer"></div>
        </div>
      </div>

      <div class="cassette-window">
        <div class="reel"><div class="reel-hub"><div class="reel-center"></div></div></div>
        <div class="reel"><div class="reel-hub"><div class="reel-center"></div></div></div>
        <div class="tape-strand"></div>
      </div>

      <div class="cassette-bottom">
        <div class="bottom-side">
          <div class="screw"></div>
          <div class="shell-spec">Stereo<br>Dolby B NR</div>
        </div>
        <div class="pin-cluster">
          <div class="pin-hole"></div>
          <div class="pin-hole pin-hole-big"></div>
          <div class="pin-hole"></div>
          <div class="pin-hole pin-hole-big"></div>
          <div class="pin-hole"></div>
        </div>
        <div class="bottom-side">
          <div class="shell-spec shell-spec-right">Made for<br>you · ♥</div>
          <div class="screw"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="front-brand">TAPE &nbsp;·&nbsp; DECK</div>
</div>
</body>
</html>`
}

export function generateBackHtml(recipientName, address, qrDataUrl, notes) {
  const addrLine = [address.city, address.state, address.zip].filter(Boolean).join(', ')
  const qrContent = qrDataUrl
    ? `<img src="${qrDataUrl}" width="96" height="96" alt="QR code">`
    : '<div class="qr-placeholder"></div>'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=Space+Mono&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 864px; height: 576px; overflow: hidden; }

  .card-back {
    width: 864px; height: 576px;
    display: flex; position: relative;
    background: radial-gradient(ellipse at 50% 50%, #fdf6e5 0%, #f4ebd5 100%);
  }
  .divider {
    position: absolute; top: 50px; bottom: 50px; left: 50%;
    width: 1px;
    background: repeating-linear-gradient(180deg,
      #b89860 0px, #b89860 2px, transparent 2px, transparent 5px);
    opacity: 0.5;
  }
  .masthead {
    position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
    font-family: 'Bebas Neue', sans-serif; font-size: 10px;
    letter-spacing: 0.42em; color: #8a6830; white-space: nowrap;
  }

  /* ── Left half ── */
  .left {
    width: 50%; padding: 50px 30px 28px;
    display: flex; flex-direction: column; gap: 14px;
    position: relative; z-index: 1;
  }
  .qr-area { display: flex; align-items: flex-start; gap: 16px; }
  .qr-box {
    width: 108px; height: 108px;
    border: 1.5px solid #2a1810; border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; background: #fffaee; overflow: hidden; padding: 6px;
  }
  .qr-box img { display: block; width: 96px; height: 96px; }
  .qr-placeholder {
    width: 96px; height: 96px;
    background-image:
      repeating-linear-gradient(0deg, #2a1810 0px, #2a1810 4px, transparent 4px, transparent 8px),
      repeating-linear-gradient(90deg, #2a1810 0px, #2a1810 4px, transparent 4px, transparent 8px);
    opacity: 0.15;
  }
  .qr-meta { display: flex; flex-direction: column; gap: 4px; padding-top: 2px; flex: 1; }
  .scan-arrow {
    font-family: 'Bebas Neue', sans-serif; font-size: 9px;
    color: #c64a08; letter-spacing: 0.2em;
  }
  .scan-label {
    font-family: 'Bebas Neue', sans-serif; font-size: 22px;
    letter-spacing: 0.06em; color: #2a1810; line-height: 0.95;
  }
  .scan-sub {
    font-family: 'Space Mono', monospace; font-size: 8px;
    color: #5a4830; letter-spacing: 0.06em; line-height: 1.6; margin-top: 4px;
  }
  .message-area {
    flex: 1; display: flex; flex-direction: column;
    justify-content: flex-end; gap: 10px; padding-bottom: 4px;
  }
  .message-label {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.22em; color: #8a6830; text-transform: uppercase;
  }
  .message-lines { display: flex; flex-direction: column; gap: 14px; }
  .message-line {
    height: 1px;
    background: repeating-linear-gradient(90deg,
      #b89860 0px, #b89860 4px, transparent 4px, transparent 8px);
    opacity: 0.45;
  }
  .message-text {
    font-family: 'Space Mono', monospace; font-size: 9px;
    color: #2a1810; line-height: 1.7; letter-spacing: 0.02em;
  }
  .made-with {
    font-family: 'Space Mono', monospace; font-size: 7px;
    color: #8a6830; letter-spacing: 0.18em; text-transform: uppercase; padding-top: 4px;
  }

  /* ── Right half ── */
  .right {
    width: 50%; padding: 50px 32px 30px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .stamp-area {
    align-self: flex-end; width: 68px; height: 84px;
    border: 1.5px dashed #b89860; border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
  }
  .stamp-label {
    font-family: 'Space Mono', monospace; font-size: 6px;
    color: #a88848; letter-spacing: 0.1em;
    text-align: center; line-height: 1.7; text-transform: uppercase;
  }
  .return-block { margin-top: 14px; }
  .return-label {
    font-family: 'Space Mono', monospace; font-size: 6px;
    letter-spacing: 0.22em; color: #a88848; text-transform: uppercase; margin-bottom: 4px;
  }
  .return-address {
    font-family: 'Space Mono', monospace; font-size: 8px;
    color: #6a5236; line-height: 1.7;
  }
  .recipient-block {
    padding: 12px 14px;
    border-left: 3px solid #c64a08; margin-left: 18px;
  }
  .to-label {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.22em; color: #c64a08;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .recipient-name {
    font-family: 'Archivo Black', sans-serif; font-size: 14px;
    color: #1c1208; margin-bottom: 3px;
  }
  .recipient-address {
    font-family: 'Space Mono', monospace; font-size: 10px;
    color: #2a1810; line-height: 1.7;
  }
  .cancel-mark {
    position: absolute; top: 28px; right: 22px;
    width: 86px; height: 86px; border-radius: 50%;
    border: 1.5px solid rgba(198,74,8,0.35);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; transform: rotate(-12deg); opacity: 0.55;
  }
  .cancel-top {
    font-family: 'Bebas Neue', sans-serif; font-size: 9px;
    letter-spacing: 0.18em; color: rgba(198,74,8,0.7);
  }
  .cancel-mid {
    font-family: 'Bebas Neue', sans-serif; font-size: 16px;
    color: rgba(198,74,8,0.75); line-height: 1; margin: 2px 0;
  }
  .cancel-bot {
    font-family: 'Space Mono', monospace; font-size: 6px;
    letter-spacing: 0.1em; color: rgba(198,74,8,0.6); text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="card-back">
  <div class="divider"></div>
  <div class="masthead">POSTCARD · TAPE DECK · PLAY ME</div>

  <div class="left">
    <div class="qr-area">
      <div class="qr-box">${qrContent}</div>
      <div class="qr-meta">
        <div class="scan-arrow">▶ SCAN</div>
        <div class="scan-label">to Play<br>the Tape</div>
        <div class="scan-sub">Opens your playlist<br>on YouTube</div>
      </div>
    </div>
    <div class="message-area">
      <div class="message-label">A note for you —</div>
      ${notes
        ? `<div class="message-text">${escapeHtml(notes)}</div>`
        : `<div class="message-lines">
            <div class="message-line"></div>
            <div class="message-line"></div>
            <div class="message-line"></div>
            <div class="message-line"></div>
          </div>`
      }
    </div>
    <div class="made-with">Pressed with care by Tape Deck</div>
  </div>

  <div class="right">
    <div class="cancel-mark">
      <div class="cancel-top">TAPE DECK</div>
      <div class="cancel-mid">2026</div>
      <div class="cancel-bot">Side A · Play</div>
    </div>
    <div>
      <div class="stamp-area">
        <div class="stamp-label">Place<br>Stamp<br>Here</div>
      </div>
      <div class="return-block">
        <div class="return-label">From</div>
        <div class="return-address">
          Tape Deck<br>
          123 Cassette Lane<br>
          San Francisco, CA 94107
        </div>
      </div>
    </div>
    <div class="recipient-block">
      <div class="to-label">▶ Deliver to</div>
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
