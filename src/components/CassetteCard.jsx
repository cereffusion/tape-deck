import styles from './CassetteCard.module.css'

const COLOR_VARS = {
  black: {
    '--body':          '#1c1c1c',
    '--body-dark':     '#0a0a0a',
    '--body-light':    '#2e2e2e',
    '--body-shine':    'rgba(255,255,255,0.08)',
    '--body-wear':     'rgba(255,220,160,0.05)',
    '--shell-edge':    '#050505',
    '--label-bg':      '#f4e4bc',
    '--label-bg2':     '#ead49a',
    '--label-txt':     '#2a1810',
    '--label-stripe':  '#c64a08',
    '--label-stripe2': '#1c1208',
    '--label-accent':  '#d97520',
    '--reel-bg':       '#2a2a2a',
    '--reel-hub':      '#4a4a4a',
    '--reel-teeth':    '#1a1a1a',
    '--screw-color':   '#2a2a2a',
    '--screw-dark':    '#0a0a0a',
    '--tape-color':    '#0c0604',
    '--tape-wound':    '#3a1a08',
    '--shell-text':    'rgba(255,200,140,0.12)',
    '--hairline':      'rgba(0,0,0,0.6)',
  },
  cream: {
    '--body':          '#ebd6a6',
    '--body-dark':     '#b89860',
    '--body-light':    '#f4e2b8',
    '--body-shine':    'rgba(255,255,255,0.4)',
    '--body-wear':     'rgba(120,70,20,0.18)',
    '--shell-edge':    '#8a6830',
    '--label-bg':      '#fff8e0',
    '--label-bg2':     '#f4e8c0',
    '--label-txt':     '#2a1400',
    '--label-stripe':  '#8a3000',
    '--label-stripe2': '#2a1400',
    '--label-accent':  '#c84a08',
    '--reel-bg':       '#b89860',
    '--reel-hub':      '#8a6830',
    '--reel-teeth':    '#6a4820',
    '--screw-color':   '#9a7838',
    '--screw-dark':    '#4a3010',
    '--tape-color':    '#1c0a04',
    '--tape-wound':    '#4a1c08',
    '--shell-text':    'rgba(80,40,10,0.35)',
    '--hairline':      'rgba(80,40,10,0.45)',
  },
  orange: {
    '--body':          '#c64a08',
    '--body-dark':     '#6a2400',
    '--body-light':    '#e85d04',
    '--body-shine':    'rgba(255,230,180,0.3)',
    '--body-wear':     'rgba(40,16,4,0.25)',
    '--shell-edge':    '#4a1800',
    '--label-bg':      '#fff4e0',
    '--label-bg2':     '#f4dcb0',
    '--label-txt':     '#2a0800',
    '--label-stripe':  '#2a0800',
    '--label-stripe2': '#f0a020',
    '--label-accent':  '#c64a08',
    '--reel-bg':       '#4a1800',
    '--reel-hub':      '#6a2400',
    '--reel-teeth':    '#2a0800',
    '--screw-color':   '#6a2400',
    '--screw-dark':    '#2a0800',
    '--tape-color':    '#0c0604',
    '--tape-wound':    '#3a1a08',
    '--shell-text':    'rgba(255,220,160,0.22)',
    '--hairline':      'rgba(0,0,0,0.4)',
  },
  blue: {
    '--body':          '#1a3a7a',
    '--body-dark':     '#0a1840',
    '--body-light':    '#2a5aa8',
    '--body-shine':    'rgba(200,220,255,0.25)',
    '--body-wear':     'rgba(180,200,255,0.08)',
    '--shell-edge':    '#050d28',
    '--label-bg':      '#f0f0e8',
    '--label-bg2':     '#d8d8c8',
    '--label-txt':     '#0a1428',
    '--label-stripe':  '#0a1428',
    '--label-stripe2': '#d4500c',
    '--label-accent':  '#d4500c',
    '--reel-bg':       '#0a1840',
    '--reel-hub':      '#1a3a7a',
    '--reel-teeth':    '#050d28',
    '--screw-color':   '#0e2255',
    '--screw-dark':    '#050d28',
    '--tape-color':    '#050818',
    '--tape-wound':    '#1a1a1a',
    '--shell-text':    'rgba(200,220,255,0.18)',
    '--hairline':      'rgba(0,0,0,0.5)',
  },
  pink: {
    '--body':          '#f4c0ca',
    '--body-dark':     '#c88090',
    '--body-light':    '#fad4dc',
    '--body-shine':    'rgba(255,255,255,0.5)',
    '--body-wear':     'rgba(140,50,70,0.16)',
    '--shell-edge':    '#a05868',
    '--label-bg':      '#fff4ee',
    '--label-bg2':     '#f4d8d2',
    '--label-txt':     '#4a0820',
    '--label-stripe':  '#c64a78',
    '--label-stripe2': '#4a0820',
    '--label-accent':  '#e85d04',
    '--reel-bg':       '#c88090',
    '--reel-hub':      '#a05868',
    '--reel-teeth':    '#6a2838',
    '--screw-color':   '#b06878',
    '--screw-dark':    '#5a1828',
    '--tape-color':    '#1a0408',
    '--tape-wound':    '#5a1828',
    '--shell-text':    'rgba(90,20,40,0.32)',
    '--hairline':      'rgba(90,20,40,0.4)',
  },
  purple: {
    '--body':          '#6a30b8',
    '--body-dark':     '#2a0858',
    '--body-light':    '#8a5ad8',
    '--body-shine':    'rgba(220,200,255,0.32)',
    '--body-wear':     'rgba(40,8,68,0.28)',
    '--shell-edge':    '#1a0440',
    '--label-bg':      '#f4ecff',
    '--label-bg2':     '#d8c4f0',
    '--label-txt':     '#1a0440',
    '--label-stripe':  '#1a0440',
    '--label-stripe2': '#f0a020',
    '--label-accent':  '#f0a020',
    '--reel-bg':       '#2a0858',
    '--reel-hub':      '#4a1888',
    '--reel-teeth':    '#1a0440',
    '--screw-color':   '#3a0c70',
    '--screw-dark':    '#1a0440',
    '--tape-color':    '#08021a',
    '--tape-wound':    '#2a0858',
    '--shell-text':    'rgba(220,200,255,0.22)',
    '--hairline':      'rgba(0,0,0,0.5)',
  },
  sage: {
    '--body':          '#9caa88',
    '--body-dark':     '#6a7858',
    '--body-light':    '#b6c4a4',
    '--body-shine':    'rgba(240,245,220,0.4)',
    '--body-wear':     'rgba(40,50,28,0.16)',
    '--shell-edge':    '#3e4a30',
    '--label-bg':      '#faf2dc',
    '--label-bg2':     '#e8dcba',
    '--label-txt':     '#1e2a14',
    '--label-stripe':  '#3a4a22',
    '--label-stripe2': '#c64a08',
    '--label-accent':  '#c64a08',
    '--reel-bg':       '#6a7858',
    '--reel-hub':      '#4e5a3c',
    '--reel-teeth':    '#2a3420',
    '--screw-color':   '#5a6848',
    '--screw-dark':    '#2e3822',
    '--tape-color':    '#0c1006',
    '--tape-wound':    '#3a2a14',
    '--shell-text':    'rgba(28,40,18,0.32)',
    '--hairline':      'rgba(28,40,18,0.4)',
  },
  clear: {
    '--body':          'rgba(255,40,160,0.22)',
    '--body-dark':     'rgba(120,10,90,0.42)',
    '--body-light':    'rgba(120,240,255,0.32)',
    '--body-shine':    'rgba(180,255,255,0.55)',
    '--body-wear':     'rgba(255,20,140,0.18)',
    '--shell-edge':    'rgba(120,10,90,0.6)',
    '--label-bg':      '#ffe8f4',
    '--label-bg2':     '#f4c0e0',
    '--label-txt':     '#1a0830',
    '--label-stripe':  '#1a0830',
    '--label-stripe2': '#00e0d4',
    '--label-accent':  '#00e0d4',
    '--reel-bg':       '#1a0a2a',
    '--reel-hub':      '#d020a0',
    '--reel-teeth':    '#0a0418',
    '--screw-color':   '#c0c8d4',
    '--screw-dark':    '#4a4858',
    '--tape-color':    'rgba(20,8,30,0.78)',
    '--tape-wound':    '#6a1880',
    '--shell-text':    'rgba(120,10,90,0.6)',
    '--hairline':      'rgba(0,0,0,0.35)',
  },
}

const BG_CLASSES = {
  brown:  '',
  black:  styles.bgBlack,
  blue:   styles.bgBlue,
  white:  styles.bgWhite,
  gray:   styles.bgGray,
  sunset: styles.bgSunset,
}

function getLabelFontSize(text) {
  const len = (text || '').length
  if (len > 32) return '1.15rem'
  if (len > 24) return '1.35rem'
  if (len > 18) return '1.6rem'
  return '1.85rem'
}

function Reel() {
  return (
    <div className={styles.reel}>
      <div className={styles.reelHub} />
    </div>
  )
}

export function CardFront({ label, color, cassetteId, orderNum, cardBg }) {
  const vars = COLOR_VARS[color] || COLOR_VARS.black
  const bgClass = BG_CLASSES[cardBg] || ''
  return (
    <div className={[styles.cardFront, bgClass].filter(Boolean).join(' ')}>
      <div className={styles.frontFrame} />
      <div className={`${styles.regMark} ${styles.regTl}`} />
      <div className={`${styles.regMark} ${styles.regTr}`} />
      <div className={`${styles.regMark} ${styles.regBl}`} />
      <div className={`${styles.regMark} ${styles.regBr}`} />

      <div className={styles.cassetteWrap}>
        <div
          className={[styles.cassette, color === 'clear' ? styles.cassetteClear : ''].filter(Boolean).join(' ')}
          style={vars}
        >

          <div className={styles.cassetteTop}>
            <div className={styles.screw} />
            <div className={styles.shellBrandTop}>MAIL-A-MIX</div>
            <div className={styles.screw} />
          </div>

          <div className={styles.cassetteLabelWell}>
            <div className={styles.cassetteLabel}>
              <div className={styles.labelHeader}>
                <div className={styles.labelBrand}>
                  MAIL<span className={styles.sep}> · </span>A<span className={styles.sep}> · </span>MIX
                </div>
                <div className={styles.labelCat}>C-{cassetteId || '90'} · NO. {orderNum || '0420'}</div>
              </div>
              <div className={styles.labelBody}>
                <div
                  className={styles.labelTitle}
                  style={{ fontSize: getLabelFontSize(label) }}
                >
                  {label || 'Your Tape'}
                </div>
                <div className={styles.labelSub}>
                  <span>Side A</span>
                  <span className={styles.bullet} />
                  <span>90 Min</span>
                  <span className={styles.bullet} />
                  <span className={styles.star}>★</span>
                  <span>Hi-Fi</span>
                </div>
              </div>
              <div className={styles.labelFooter} />
            </div>
          </div>

          <div className={[styles.cassetteWindow, color === 'clear' ? styles.cassetteWindowClear : ''].filter(Boolean).join(' ')}>
            <Reel />
            <Reel />
            <div className={styles.headSlot}>
              <div className={styles.headPin} />
              <div className={`${styles.headPin} ${styles.headPinWide}`} />
              <div className={`${styles.headPin} ${styles.headPinWide}`} />
              <div className={styles.headPin} />
            </div>
          </div>

          <div className={styles.cassetteBottom}>
            <div className={styles.bottomSide}>
              <div className={styles.screw} />
              <div className={`${styles.shellSpec} ${styles.shellSpecLeft}`}>
                Stereo<br />Dolby&nbsp;B&nbsp;NR
              </div>
            </div>
            <div className={styles.pinCluster}>
              <div className={styles.pinHole} />
              <div className={`${styles.pinHole} ${styles.pinHoleBig}`} />
              <div className={styles.pinHole} />
              <div className={`${styles.pinHole} ${styles.pinHoleBig}`} />
              <div className={styles.pinHole} />
            </div>
            <div className={styles.bottomSide}>
              <div className={styles.shellSpec}>Made for<br />you · ♥</div>
              <div className={styles.screw} />
            </div>
          </div>

        </div>
      </div>

      <div className={styles.frontBrand}>
        MAIL<span className={styles.dot} />A<span className={styles.dot} />MIX
      </div>
      <div className={styles.frontUrl}>mailamix.com</div>
    </div>
  )
}

export function CardBack({ recipientName, address, qrDataUrl, notes, senderName }) {
  const addrLine = [address?.city, address?.state, address?.zip].filter(Boolean).join(', ')
  return (
    <div className={styles.cardBack}>
      <div className={styles.postcardMasthead}>
        POSTCARD<span className={styles.dot} />MAIL-A-MIX<span className={styles.dot} />PLAY ME
      </div>

      <div className={styles.cardBackLeft}>
        <div className={styles.senderBlock}>
          <div className={styles.senderLabel}>A mixtape from</div>
          <div className={styles.senderName}>{senderName || 'A friend'}</div>
        </div>

        <div className={styles.messageArea}>
          <div className={styles.messageLabel}>A note for you —</div>
          {notes
            ? <div className={styles.messageText}>{notes}</div>
            : <div className={styles.messageLines}>
                <div className={styles.messageLine} />
                <div className={styles.messageLine} />
                <div className={styles.messageLine} />
                <div className={styles.messageLine} />
              </div>
          }
        </div>

        <div className={styles.qrArea}>
          <div className={styles.qrBox}>
            {qrDataUrl
              ? <img src={qrDataUrl} alt="QR code" width="96" height="96" />
              : <div className={styles.qrPlaceholder} />
            }
          </div>
          <div className={styles.qrMeta}>
            <div className={styles.scanArrow}>▶ SCAN</div>
            <div className={styles.scanLabel}>to Play<br />the Tape</div>
            <div className={styles.scanSub}>Opens your playlist<br />on YouTube</div>
          </div>
        </div>
      </div>

      <div className={styles.cardBackRight}>
        <div className={styles.cancelMark}>
          <div className={styles.cancelTop}>MAIL-A-MIX</div>
          <div className={styles.cancelMid}>2026</div>
          <div className={styles.cancelBot}>Side A · Play</div>
        </div>

        <div className={styles.returnBlock}>
          <div className={styles.returnLabel}>From</div>
          <div className={styles.returnAddress}>
            Mail-a-Mix<br />
            5504 13th Ave<br />
            Unit #214<br />
            Brooklyn, NY 11219
          </div>
          <div className={styles.returnUrl}>mailamix.com</div>
        </div>

        <div className={styles.recipientBlock}>
          <div className={styles.toLabel}>▶ Deliver to</div>
          <div className={styles.recipientName}>{recipientName || 'Recipient Name'}</div>
          <div className={styles.recipientAddress}>
            {address?.line1 || '123 Main Street'}<br />
            {address?.line2 && <>{address.line2}<br /></>}
            {addrLine || 'City, ST 00000'}
          </div>
        </div>
      </div>
    </div>
  )
}
