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

export function CardFront({ label, color }) {
  const vars = COLOR_VARS[color] || COLOR_VARS.black
  return (
    <div className={styles.cardFront}>
      <div className={styles.frontFrame} />
      <div className={`${styles.regMark} ${styles.regTl}`} />
      <div className={`${styles.regMark} ${styles.regTr}`} />
      <div className={`${styles.regMark} ${styles.regBl}`} />
      <div className={`${styles.regMark} ${styles.regBr}`} />

      <div className={styles.frontStock}>CHROME · TYPE II</div>
      <div className={styles.frontCat}>TD-0420</div>

      <div className={styles.cassetteWrap}>
        <div className={`${styles.cassette} ${styles[color] || styles.black}`} style={vars}>

          <div className={styles.cassetteTop}>
            <div className={styles.screw} />
            <div className={styles.shellBrandTop}>TAPE DECK</div>
            <div className={styles.screw} />
          </div>

          <div className={styles.cassetteLabelWell}>
            <div className={styles.cassetteLabel}>
              <div className={styles.labelHeader}>
                <div className={styles.labelBrand}>
                  TAPE<span className={styles.sep}> · </span>DECK
                </div>
                <div className={styles.labelCat}>C-90 · NO. 0420</div>
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

          <div className={styles.cassetteWindow}>
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
        TAPE<span className={styles.dot} />DECK
      </div>
    </div>
  )
}

export function CardBack({ recipientName, address, qrDataUrl, notes }) {
  const addrLine = [address?.city, address?.state, address?.zip].filter(Boolean).join(', ')
  return (
    <div className={styles.cardBack}>
      <div className={styles.postcardMasthead}>
        POSTCARD<span className={styles.dot} />TAPE DECK<span className={styles.dot} />PLAY ME
      </div>

      <div className={styles.cardBackLeft}>
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

        <div className={styles.madeWith}>Pressed with care by Tape Deck</div>
      </div>

      <div className={styles.cardBackRight}>
        <div className={styles.cancelMark}>
          <div className={styles.cancelTop}>TAPE DECK</div>
          <div className={styles.cancelMid}>2026</div>
          <div className={styles.cancelBot}>Side A · Play</div>
        </div>

        <div>
          <div className={styles.stampArea}>
            <span className={styles.stampLabel}>Place<br />Stamp<br />Here</span>
          </div>
          <div className={styles.returnBlock}>
            <div className={styles.returnLabel}>From</div>
            <div className={styles.returnAddress}>
              Tape Deck<br />
              123 Cassette Lane<br />
              San Francisco, CA 94107
            </div>
          </div>
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
