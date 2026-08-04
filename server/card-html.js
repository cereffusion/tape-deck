// Generates self-contained front/back HTML for PostGrid print rendering.
// All CSS is inlined — no external stylesheets except Google Fonts.

const COLORS = {
  black: {
    body: '#1c1c1c', bodyDark: '#0a0a0a', bodyLight: '#2e2e2e',
    bodyWear: 'rgba(255,220,160,0.05)', shellEdge: '#050505',
    labelBg: '#f4e4bc', labelBg2: '#ead49a', labelTxt: '#2a1810',
    labelStripe: '#c64a08', labelStripe2: '#1c1208', labelAccent: '#d97520',
    reelBg: '#2a2a2a', reelHub: '#4a4a4a', reelTeeth: '#1a1a1a',
    screwColor: '#2a2a2a', screwDark: '#0a0a0a',
    tapeColor: '#0c0604', tapeWound: '#3a1a08',
    shellText: 'rgba(255,200,140,0.12)',
  },
  cream: {
    body: '#ebd6a6', bodyDark: '#b89860', bodyLight: '#f4e2b8',
    bodyWear: 'rgba(120,70,20,0.18)', shellEdge: '#8a6830',
    labelBg: '#fff8e0', labelBg2: '#f4e8c0', labelTxt: '#2a1400',
    labelStripe: '#8a3000', labelStripe2: '#2a1400', labelAccent: '#c84a08',
    reelBg: '#b89860', reelHub: '#8a6830', reelTeeth: '#6a4820',
    screwColor: '#9a7838', screwDark: '#4a3010',
    tapeColor: '#1c0a04', tapeWound: '#4a1c08',
    shellText: 'rgba(80,40,10,0.35)',
  },
  orange: {
    body: '#c64a08', bodyDark: '#6a2400', bodyLight: '#e85d04',
    bodyWear: 'rgba(40,16,4,0.25)', shellEdge: '#4a1800',
    labelBg: '#fff4e0', labelBg2: '#f4dcb0', labelTxt: '#2a0800',
    labelStripe: '#2a0800', labelStripe2: '#f0a020', labelAccent: '#c64a08',
    reelBg: '#4a1800', reelHub: '#6a2400', reelTeeth: '#2a0800',
    screwColor: '#6a2400', screwDark: '#2a0800',
    tapeColor: '#0c0604', tapeWound: '#3a1a08',
    shellText: 'rgba(255,220,160,0.22)',
  },
  blue: {
    body: '#1a3a7a', bodyDark: '#0a1840', bodyLight: '#2a5aa8',
    bodyWear: 'rgba(180,200,255,0.08)', shellEdge: '#050d28',
    labelBg: '#f0f0e8', labelBg2: '#d8d8c8', labelTxt: '#0a1428',
    labelStripe: '#0a1428', labelStripe2: '#d4500c', labelAccent: '#d4500c',
    reelBg: '#0a1840', reelHub: '#1a3a7a', reelTeeth: '#050d28',
    screwColor: '#0e2255', screwDark: '#050d28',
    tapeColor: '#050818', tapeWound: '#1a1a1a',
    shellText: 'rgba(200,220,255,0.18)',
  },
  pink: {
    body: '#f4c0ca', bodyDark: '#c88090', bodyLight: '#fad4dc',
    bodyWear: 'rgba(140,50,70,0.16)', shellEdge: '#a05868',
    labelBg: '#fff4ee', labelBg2: '#f4d8d2', labelTxt: '#4a0820',
    labelStripe: '#c64a78', labelStripe2: '#4a0820', labelAccent: '#e85d04',
    reelBg: '#c88090', reelHub: '#a05868', reelTeeth: '#6a2838',
    screwColor: '#b06878', screwDark: '#5a1828',
    tapeColor: '#1a0408', tapeWound: '#5a1828',
    shellText: 'rgba(90,20,40,0.32)',
  },
  purple: {
    body: '#6a30b8', bodyDark: '#2a0858', bodyLight: '#8a5ad8',
    bodyWear: 'rgba(40,8,68,0.28)', shellEdge: '#1a0440',
    labelBg: '#f4ecff', labelBg2: '#d8c4f0', labelTxt: '#1a0440',
    labelStripe: '#1a0440', labelStripe2: '#f0a020', labelAccent: '#f0a020',
    reelBg: '#2a0858', reelHub: '#4a1888', reelTeeth: '#1a0440',
    screwColor: '#3a0c70', screwDark: '#1a0440',
    tapeColor: '#08021a', tapeWound: '#2a0858',
    shellText: 'rgba(220,200,255,0.22)',
  },
  sage: {
    body: '#9caa88', bodyDark: '#6a7858', bodyLight: '#b6c4a4',
    bodyWear: 'rgba(40,50,28,0.16)', shellEdge: '#3e4a30',
    labelBg: '#faf2dc', labelBg2: '#e8dcba', labelTxt: '#1e2a14',
    labelStripe: '#3a4a22', labelStripe2: '#c64a08', labelAccent: '#c64a08',
    reelBg: '#6a7858', reelHub: '#4e5a3c', reelTeeth: '#2a3420',
    screwColor: '#5a6848', screwDark: '#2e3822',
    tapeColor: '#0c1006', tapeWound: '#3a2a14',
    shellText: 'rgba(28,40,18,0.32)',
  },
  clear: {
    body: 'rgba(255,40,160,0.22)', bodyDark: 'rgba(120,10,90,0.42)', bodyLight: 'rgba(120,240,255,0.32)',
    bodyWear: 'rgba(255,20,140,0.18)', shellEdge: 'rgba(120,10,90,0.6)',
    labelBg: '#ffe8f4', labelBg2: '#f4c0e0', labelTxt: '#1a0830',
    labelStripe: '#1a0830', labelStripe2: '#00e0d4', labelAccent: '#00e0d4',
    reelBg: '#1a0a2a', reelHub: '#d020a0', reelTeeth: '#0a0418',
    screwColor: '#c0c8d4', screwDark: '#4a4858',
    tapeColor: 'rgba(20,8,30,0.78)', tapeWound: '#6a1880',
    shellText: 'rgba(120,10,90,0.6)',
  },
}

function getLabelFontSize(text) {
  const len = (text || '').length
  if (len > 32) return '28px'
  if (len > 24) return '33px'
  if (len > 18) return '38px'
  return '44px'
}

const BG_VARIANTS = {
  brown:  { bg1:'#2a1a0c',  bg2:'#1a0e06', bg3:'#1c1208', bg4:'#120a04', accent:'rgba(240,160,32,0.42)',  accentSoft:'rgba(240,160,32,0.12)',  reg:'#6a4a20',               grainBlend:'overlay',  grainOpacity:'0.7',  speckleOpacity:'0.4'  },
  black:  { bg1:'#1c1c1c',  bg2:'#050505', bg3:'#1a1a1a', bg4:'#050505', accent:'rgba(240,200,140,0.42)', accentSoft:'rgba(240,200,140,0.12)', reg:'#5a5044',               grainBlend:'overlay',  grainOpacity:'0.6',  speckleOpacity:'0.35' },
  blue:   { bg1:'#c8d4e0',  bg2:'#98aecc', bg3:'#b4c4d8', bg4:'#98aecc', accent:'rgba(40,60,90,0.55)',    accentSoft:'rgba(40,60,90,0.18)',    reg:'#3a4858',               grainBlend:'multiply', grainOpacity:'0.35', speckleOpacity:'0.3'  },
  white:  { bg1:'#ffffff',  bg2:'#ebe2cf', bg3:'#f5ecd8', bg4:'#e8ddc4', accent:'rgba(100,60,20,0.5)',    accentSoft:'rgba(100,60,20,0.16)',   reg:'#6a4a20',               grainBlend:'multiply', grainOpacity:'0.3',  speckleOpacity:'0.25' },
  gray:   { bg1:'#c8c4be',  bg2:'#989088', bg3:'#b4ada4', bg4:'#9a928a', accent:'rgba(50,40,30,0.5)',     accentSoft:'rgba(50,40,30,0.14)',    reg:'#3a3028',               grainBlend:'multiply', grainOpacity:'0.35', speckleOpacity:'0.3'  },
  sunset: { bg1:'#ffb4d2',  bg2:'#5a1a8c', bg3:'#f48ac4', bg4:'#4a1080', accent:'rgba(255,230,200,0.55)', accentSoft:'rgba(255,230,200,0.18)', reg:'rgba(255,240,220,0.45)', grainBlend:'overlay',  grainOpacity:'0.32', speckleOpacity:'0.28' },
}

export function generateFrontHtml(label, color, cassetteId, orderNum, cardBg) {
  const c   = COLORS[color] || COLORS.black
  const bg  = BG_VARIANTS[cardBg] || BG_VARIANTS.brown
  const isClear = color === 'clear'

  const cassetteShell = isClear
    ? 'box-shadow: inset 0 1px 0 rgba(180,255,255,0.45), inset 0 -2px 0 rgba(120,10,90,0.4), inset 1px 0 0 rgba(180,255,255,0.2), inset -1px 0 0 rgba(120,10,90,0.3), 0 0 0 1px rgba(120,10,90,0.55);'
    : `box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.04), inset -1px 0 0 rgba(0,0,0,0.5), 0 0 0 1px ${c.shellEdge};`

  const windowBg = isClear
    ? 'background: radial-gradient(ellipse 220px 60px at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 70%), rgba(30,10,40,0.55);'
    : `background: radial-gradient(ellipse 220px 60px at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%), ${c.tapeColor};`

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 864px; height: 576px; overflow: hidden; background: #fff; }

  .card-front {
    width: 864px; height: 576px; position: relative;
    display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(ellipse at 30% 20%, ${bg.bg1} 0%, transparent 55%),
      radial-gradient(ellipse at 70% 80%, ${bg.bg2} 0%, transparent 60%),
      linear-gradient(135deg, ${bg.bg3} 0%, ${bg.bg4} 100%);
  }
  .card-front::before {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' seed='5'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.7  0 0 0 0 0.4  0 0 0 0.5 0'/></filter><rect width='400' height='400' filter='url(%23n)' opacity='0.35'/></svg>");
    mix-blend-mode: ${bg.grainBlend}; opacity: ${bg.grainOpacity}; pointer-events: none; z-index: 1;
  }
  .card-front::after {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.18' numOctaves='2' stitchTiles='stitch' seed='2'/></filter><rect width='220' height='220' filter='url(%23n)' opacity='0.5'/></svg>");
    mix-blend-mode: soft-light; opacity: ${bg.speckleOpacity}; pointer-events: none; z-index: 2;
  }

  .front-frame {
    position: absolute; inset: 22px;
    border: 1px dashed ${bg.accentSoft}; border-radius: 2px;
    pointer-events: none; z-index: 3;
  }
  .reg-mark {
    position: absolute; width: 14px; height: 14px;
    z-index: 3; pointer-events: none; opacity: 0.35;
  }
  .reg-mark::before, .reg-mark::after {
    content: ''; position: absolute; background: ${bg.reg};
  }
  .reg-mark::before { left: 50%; top: 0; bottom: 0; width: 1px; transform: translateX(-50%); }
  .reg-mark::after  { top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%); }
  .reg-tl { top: 10px; left: 10px; }
  .reg-tr { top: 10px; right: 10px; }
  .reg-bl { bottom: 10px; left: 10px; }
  .reg-br { bottom: 10px; right: 10px; }

  .front-brand {
    position: absolute; bottom: 22px; left: 0; right: 0; text-align: center;
    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
    letter-spacing: 0.55em; color: ${bg.accent}; padding-left: 0.55em; z-index: 4;
  }
  .front-brand .dot {
    display: inline-block; width: 4px; height: 4px;
    background: ${bg.accent}; border-radius: 50%;
    vertical-align: middle; margin: 0 10px 2px;
  }
  .front-url {
    position: absolute; bottom: 8px; left: 0; right: 0; text-align: center;
    font-family: 'Space Mono', monospace; font-size: 8px;
    letter-spacing: 0.28em; color: ${bg.accent}; opacity: 0.8;
    padding-left: 0.28em; z-index: 4; text-transform: lowercase;
  }

  .cassette-wrap {
    position: relative; z-index: 5; transform: rotate(-1.2deg);
    filter: drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 6px 8px rgba(0,0,0,0.45));
  }

  .cassette {
    position: relative; width: 540px; height: 340px; border-radius: 8px;
    padding: 14px 22px 12px; display: flex; flex-direction: column; align-items: center;
    background:
      linear-gradient(180deg,
        rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 4%,
        transparent 8%, transparent 92%, rgba(0,0,0,0.25) 100%),
      linear-gradient(170deg, ${c.bodyLight} 0%, ${c.body} 35%, ${c.bodyDark} 100%);
    ${cassetteShell}
  }
  .cassette::before {
    content: ''; position: absolute; inset: 0; border-radius: 8px;
    background:
      linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 3%, transparent 6%,
        transparent 94%, rgba(0,0,0,0.06) 97%, rgba(0,0,0,0.22) 100%),
      radial-gradient(ellipse 80px 30px at 14% 20%, ${c.bodyWear} 0%, transparent 70%),
      radial-gradient(ellipse 40px 15px at 70% 12%, rgba(255,255,255,0.06) 0%, transparent 70%);
    pointer-events: none; mix-blend-mode: screen;
  }
  .cassette::after {
    content: ''; position: absolute; inset: 0; border-radius: 8px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch' seed='8'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.45'/></svg>");
    mix-blend-mode: overlay; opacity: 0.35; pointer-events: none;
  }

  .cassette-top {
    position: relative; width: 100%; height: 14px;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .cassette-top::before, .cassette-top::after {
    content: ''; position: absolute; top: -2px;
    width: 22px; height: 8px; background: ${c.shellEdge};
    box-shadow: inset 0 -1px 0 rgba(255,255,255,0.08), inset 0 1px 1px rgba(0,0,0,0.6);
    border-radius: 0 0 2px 2px;
  }
  .cassette-top::before { left: 38px; }
  .cassette-top::after  { right: 38px; }
  .shell-brand-top {
    position: absolute; top: 1px; left: 50%; transform: translateX(-50%);
    font-family: 'Bebas Neue', sans-serif; font-size: 8px;
    letter-spacing: 0.4em; color: ${c.shellText}; padding-left: 0.4em;
  }

  .screw {
    width: 11px; height: 11px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, ${c.screwColor} 0%, ${c.screwDark} 80%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4);
    position: relative; flex-shrink: 0; z-index: 2;
  }
  .screw::after {
    content: ''; position: absolute; top: 50%; left: 18%; right: 18%; height: 1.5px;
    background: rgba(0,0,0,0.7); transform: translateY(-50%) rotate(38deg); border-radius: 1px;
  }

  .cassette-label-well {
    width: calc(100% - 32px); padding: 4px; margin: 6px 0 4px;
    background: ${c.shellEdge}; border-radius: 4px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.7), inset 0 -1px 1px rgba(255,255,255,0.05);
    flex-shrink: 0;
  }
  .cassette-label {
    width: 100%; height: 86px;
    background: linear-gradient(180deg, ${c.labelBg} 0%, ${c.labelBg2} 100%);
    border-radius: 2px; display: flex; flex-direction: column; overflow: hidden;
    position: relative; transform: rotate(0.3deg);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.4);
  }
  .cassette-label::before {
    content: ''; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch' seed='3'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.5'/></svg>");
    mix-blend-mode: multiply; opacity: 0.18; pointer-events: none;
  }
  .cassette-label::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(120,70,30,0.18) 100%);
    pointer-events: none;
  }
  .label-header {
    height: 18px; background: ${c.labelStripe};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 10px; flex-shrink: 0; box-shadow: 0 1px 0 rgba(0,0,0,0.2);
  }
  .label-brand {
    font-family: 'Bebas Neue', sans-serif; font-size: 10px;
    letter-spacing: 0.26em; color: ${c.labelBg}; padding-left: 0.26em;
    mix-blend-mode: screen; white-space: nowrap;
  }
  .label-brand .sep { display: inline-block; margin: 0 0.5em; opacity: 0.7; }
  .label-cat {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.16em; color: ${c.labelBg}; opacity: 0.85; white-space: nowrap;
  }
  .label-body {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 4px 18px 2px; position: relative; gap: 1px;
  }
  .label-title {
    font-family: 'Bebas Neue', sans-serif; font-size: ${getLabelFontSize(label)};
    letter-spacing: 0.06em; color: ${c.labelTxt}; text-align: center; line-height: 1;
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding-left: 0.06em;
    text-shadow: 0.6px 0.6px 0 ${c.labelAccent}, -0.4px -0.4px 0 rgba(180,40,80,0.08);
    position: relative; z-index: 2;
  }
  .label-sub {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.18em; color: ${c.labelStripe};
    text-transform: uppercase; opacity: 0.85; margin-top: 1px;
  }
  .label-sub .bullet {
    display: inline-block; width: 3px; height: 3px;
    background: currentColor; border-radius: 50%; opacity: 0.7;
  }
  .label-sub .star { color: ${c.labelAccent}; font-size: 9px; line-height: 1; }
  .label-footer {
    height: 8px;
    background: repeating-linear-gradient(90deg,
      ${c.labelStripe2} 0px, ${c.labelStripe2} 6px, ${c.labelBg2} 6px, ${c.labelBg2} 8px);
    opacity: 0.7; flex-shrink: 0;
  }

  .cassette-window {
    width: calc(100% - 36px); height: 142px; border-radius: 4px; position: relative;
    display: flex; align-items: center; justify-content: space-between; padding: 0 30px;
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.85), inset 0 -1px 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
    flex-shrink: 0; overflow: hidden;
    ${windowBg}
  }
  .cassette-window::before {
    content: ''; position: absolute; top: 6px; left: 8px; right: 50%; height: 14px;
    background: linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 50%, transparent 100%);
    border-radius: 2px; pointer-events: none;
  }
  .cassette-window::after {
    content: ''; position: absolute; bottom: 26px; left: 70px; right: 70px; height: 5px;
    background: linear-gradient(to right, transparent 0%, rgba(80,40,10,0.65) 5%,
      ${c.tapeWound} 50%, rgba(80,40,10,0.65) 95%, transparent 100%);
    border-radius: 1px; box-shadow: 0 1px 2px rgba(0,0,0,0.6);
  }

  .head-slot {
    position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
    width: 110px; height: 12px; border-radius: 2px;
    background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: space-between; padding: 0 8px;
  }
  .head-pin { width: 3px; height: 6px; background: linear-gradient(180deg, #888 0%, #2a2a2a 100%); border-radius: 1px; }
  .head-pin.wide { width: 8px; height: 4px; background: linear-gradient(180deg, #aaa 0%, #444 100%); }

  .reel {
    width: 92px; height: 92px; border-radius: 50%;
    background: radial-gradient(circle at 50% 50%,
      ${c.reelHub} 0%, ${c.reelHub} 18%, ${c.reelBg} 19%, ${c.reelBg} 26%,
      ${c.tapeWound} 27%, #1a0c04 80%, ${c.reelTeeth} 81%, ${c.reelTeeth} 100%);
    position: relative; flex-shrink: 0;
    box-shadow: 0 0 0 1.5px rgba(0,0,0,0.7), inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 3px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
  }
  .reel::after {
    content: ''; position: absolute; inset: 2px; border-radius: 50%;
    background: repeating-conic-gradient(from 0deg,
      rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 8deg, rgba(0,0,0,0.45) 8deg, rgba(0,0,0,0.45) 10deg);
    -webkit-mask: radial-gradient(circle, transparent 78%, #000 79%, #000 100%);
    mask: radial-gradient(circle, transparent 78%, #000 79%, #000 100%);
    pointer-events: none;
  }
  .reel-hub {
    width: 34px; height: 34px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, ${c.reelHub} 0%, ${c.reelTeeth} 100%);
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -2px 3px rgba(0,0,0,0.5), 0 0 0 2px rgba(0,0,0,0.5);
    position: relative; display: flex; align-items: center; justify-content: center; z-index: 2;
  }
  .reel-hub::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    background: conic-gradient(from 0deg,
      ${c.reelTeeth} 0deg 6deg, transparent 6deg 60deg,
      ${c.reelTeeth} 60deg 66deg, transparent 66deg 120deg,
      ${c.reelTeeth} 120deg 126deg, transparent 126deg 180deg,
      ${c.reelTeeth} 180deg 186deg, transparent 186deg 240deg,
      ${c.reelTeeth} 240deg 246deg, transparent 246deg 300deg,
      ${c.reelTeeth} 300deg 306deg, transparent 306deg 360deg);
    -webkit-mask: radial-gradient(circle, #000 0%, #000 35%, transparent 36%);
    mask: radial-gradient(circle, #000 0%, #000 35%, transparent 36%);
  }
  .reel-hub::after {
    content: ''; width: 13px; height: 13px; border-radius: 50%;
    background: ${c.tapeColor}; box-shadow: inset 0 1px 3px rgba(0,0,0,0.9);
    position: relative; z-index: 3;
  }

  .cassette-bottom {
    width: 100%; height: 32px; display: grid; grid-template-columns: auto 1fr auto;
    align-items: center; gap: 14px; padding: 6px 4px 0; flex-shrink: 0;
  }
  .bottom-side { display: flex; align-items: center; gap: 10px; }
  .pin-cluster {
    display: flex; gap: 6px; align-items: center; justify-content: center;
    padding: 4px 14px; border-radius: 3px; background: ${c.shellEdge};
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04);
  }
  .pin-hole { width: 4px; height: 4px; border-radius: 50%; background: rgba(0,0,0,0.6); box-shadow: inset 0 0 1px rgba(0,0,0,0.9); }
  .pin-hole.big { width: 7px; height: 7px; }
  .shell-spec {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.2em; color: ${c.shellText};
    text-transform: uppercase; white-space: nowrap; line-height: 1.3; text-align: right;
  }
  .shell-spec-left { text-align: left; }
</style>
</head>
<body>
<div class="card-front">
  <div class="front-frame"></div>
  <div class="reg-mark reg-tl"></div>
  <div class="reg-mark reg-tr"></div>
  <div class="reg-mark reg-bl"></div>
  <div class="reg-mark reg-br"></div>

  <div class="cassette-wrap">
    <div class="cassette">
      <div class="cassette-top">
        <div class="screw"></div>
        <div class="shell-brand-top">MAIL-A-MIX</div>
        <div class="screw"></div>
      </div>

      <div class="cassette-label-well">
        <div class="cassette-label">
          <div class="label-header">
            <div class="label-brand">MAIL<span class="sep">&middot;</span>A<span class="sep">&middot;</span>MIX</div>
            <div class="label-cat">C-${cassetteId || '90'} &middot; NO. ${orderNum || '0420'}</div>
          </div>
          <div class="label-body">
            <div class="label-title">${escapeHtml(label || 'Your Tape')}</div>
            <div class="label-sub">
              <span>Side A</span>
              <span class="bullet"></span>
              <span>90 Min</span>
              <span class="bullet"></span>
              <span class="star">&#9733;</span>
              <span>Hi-Fi</span>
            </div>
          </div>
          <div class="label-footer"></div>
        </div>
      </div>

      <div class="cassette-window">
        <div class="reel"><div class="reel-hub"></div></div>
        <div class="reel"><div class="reel-hub"></div></div>
        <div class="head-slot">
          <div class="head-pin"></div>
          <div class="head-pin wide"></div>
          <div class="head-pin wide"></div>
          <div class="head-pin"></div>
        </div>
      </div>

      <div class="cassette-bottom">
        <div class="bottom-side">
          <div class="screw"></div>
          <div class="shell-spec shell-spec-left">Stereo<br>Dolby&nbsp;B&nbsp;NR</div>
        </div>
        <div class="pin-cluster">
          <div class="pin-hole"></div>
          <div class="pin-hole big"></div>
          <div class="pin-hole"></div>
          <div class="pin-hole big"></div>
          <div class="pin-hole"></div>
        </div>
        <div class="bottom-side">
          <div class="shell-spec">Made for<br>you &middot; &hearts;</div>
          <div class="screw"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="front-brand">MAIL<span class="dot"></span>A<span class="dot"></span>MIX</div>
  <div class="front-url">mailamix.com</div>
</div>
</body>
</html>`
}

// Per PostGrid's US 6x4 guideline: the back's right 40% (address & indicia)
// and the bottom 4.75in x 0.625in barcode strip must carry no artwork or ink,
// or the order is cancelled ("Content found overlapping address region").
// All content — including the grain texture — stays inside the left 60%,
// above the strip. PostGrid prints recipient + return address in its zone.
export function generateBackHtml(recipientName, address, qrDataUrl, notes, senderName) {
  const qrContent = qrDataUrl
    ? `<img src="${qrDataUrl}" width="96" height="96" alt="QR code">`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 864px; height: 576px; overflow: hidden; }

  .card-back {
    width: 864px; height: 576px; position: relative;
    background: radial-gradient(ellipse at 50% 50%, #fdf6e5 0%, #f4ebd5 100%);
  }
  /* Grain clipped to the printable area: right 346px and bottom 90px stay clean */
  .card-back::before {
    content: ''; position: absolute; top: 0; left: 0; right: 346px; bottom: 90px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch' seed='4'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 0.6 0'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='0.4'/></svg>");
    mix-blend-mode: multiply; opacity: 0.25; pointer-events: none;
    -webkit-mask-image: linear-gradient(90deg, #000 82%, transparent 100%);
    mask-image: linear-gradient(90deg, #000 82%, transparent 100%);
  }

  /* All content confined here: left of x=518, above y=486, with buffer */
  .safe {
    position: absolute; top: 26px; left: 30px; width: 452px; height: 418px;
    display: flex; flex-direction: column; gap: 20px; z-index: 1;
  }

  .postcard-masthead {
    font-family: 'Bebas Neue', sans-serif; font-size: 10px;
    letter-spacing: 0.42em; color: #8a6830; white-space: nowrap;
    border-bottom: 1px dashed rgba(184,152,96,0.45); padding-bottom: 10px;
  }
  .postcard-masthead .dot {
    display: inline-block; width: 3px; height: 3px; background: #c64a08;
    border-radius: 50%; vertical-align: middle; margin: 0 10px 3px;
  }

  .cancel-mark {
    position: absolute; top: 30px; right: 6px;
    width: 74px; height: 74px; border-radius: 50%;
    border: 1.5px solid rgba(198,74,8,0.35);
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    transform: rotate(-12deg); opacity: 0.55; pointer-events: none; z-index: 0;
  }
  .cancel-mark::before {
    content: ''; position: absolute; inset: 5px;
    border-radius: 50%; border: 1px dashed rgba(198,74,8,0.4);
  }
  .cancel-mark .top { font-family: 'Bebas Neue', sans-serif; font-size: 8px; letter-spacing: 0.18em; color: rgba(198,74,8,0.7); padding-left: 0.18em; }
  .cancel-mark .mid { font-family: 'Bebas Neue', sans-serif; font-size: 14px; color: rgba(198,74,8,0.75); line-height: 1; margin: 2px 0; }
  .cancel-mark .bot { font-family: 'Space Mono', monospace; font-size: 5.5px; letter-spacing: 0.1em; color: rgba(198,74,8,0.6); text-transform: uppercase; }

  .sender-block {
    display: flex; align-items: baseline; gap: 10px;
    padding: 8px 0 4px; border-bottom: 1px dashed rgba(184,152,96,0.45);
    margin-right: 92px; /* clear of the cancel mark */
  }
  .sender-label {
    font-family: 'Space Mono', monospace; font-size: 7px;
    letter-spacing: 0.22em; color: #8a6830; text-transform: uppercase; flex-shrink: 0;
  }
  .sender-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 16px;
    letter-spacing: 0.06em; color: #2a1810; line-height: 1; padding-left: 0.06em; flex: 1;
  }

  .qr-area { display: flex; align-items: flex-start; gap: 16px; }
  .qr-box {
    width: 108px; height: 108px; border: 1.5px solid #2a1810; border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; background: #fffaee; overflow: hidden; padding: 6px;
  }
  .qr-box img { display: block; width: 96px; height: 96px; }
  .qr-meta { display: flex; flex-direction: column; gap: 4px; padding-top: 2px; flex: 1; }
  .scan-arrow { font-family: 'Bebas Neue', sans-serif; font-size: 9px; color: #c64a08; letter-spacing: 0.2em; }
  .scan-label { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; color: #2a1810; line-height: 0.95; }
  .scan-sub { font-family: 'Space Mono', monospace; font-size: 8px; color: #5a4830; letter-spacing: 0.06em; line-height: 1.6; margin-top: 4px; }

  .message-area { display: flex; flex-direction: column; gap: 10px; padding-bottom: 4px; }
  .message-label { font-family: 'Space Mono', monospace; font-size: 7px; letter-spacing: 0.22em; color: #8a6830; text-transform: uppercase; }
  .notes-text { font-family: 'Space Mono', monospace; font-size: 10px; line-height: 1.6; color: #2a1810; white-space: pre-wrap; min-height: 44px; }
  .message-lines { display: flex; flex-direction: column; gap: 14px; min-height: 44px; justify-content: flex-end; }
  .message-line { height: 1px; background: repeating-linear-gradient(90deg, #b89860 0px, #b89860 4px, transparent 4px, transparent 8px); opacity: 0.45; }

</style>
</head>
<body>
<div class="card-back">
  <div class="safe">
    <div class="postcard-masthead">POSTCARD<span class="dot"></span>MAIL-A-MIX<span class="dot"></span>PLAY ME</div>

    <div class="cancel-mark">
      <div class="top">MAIL-A-MIX</div>
      <div class="mid">2026</div>
      <div class="bot">Side A &middot; Play</div>
    </div>

    <div class="sender-block">
      <div class="sender-label">A mixtape from</div>
      <div class="sender-name">${escapeHtml(senderName || 'A friend')}</div>
    </div>

    <div class="message-area">
      <div class="message-label">A note for you &mdash;</div>
      ${notes
        ? `<div class="notes-text">${escapeHtml(notes)}</div>`
        : `<div class="message-lines">
            <div class="message-line"></div>
            <div class="message-line"></div>
            <div class="message-line"></div>
          </div>`
      }
    </div>

    <div class="qr-area">
      <div class="qr-box">${qrContent}</div>
      <div class="qr-meta">
        <div class="scan-arrow">&#9654; SCAN</div>
        <div class="scan-label">to Play<br>the Tape</div>
        <div class="scan-sub">Opens your playlist<br>on YouTube</div>
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
