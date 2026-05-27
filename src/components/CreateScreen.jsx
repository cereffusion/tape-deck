import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { CardFront, CardBack } from './CassetteCard.jsx'
import styles from './CreateScreen.module.css'

const COLORS = [
  { id: 'black',  label: 'Classic Black', hex: '#1e1e1e' },
  { id: 'cream',  label: 'Cream',         hex: '#f0deb0' },
  { id: 'orange', label: 'Orange',        hex: '#c94a00' },
  { id: 'blue',   label: 'Blue',          hex: '#1a3a7a' },
]

const YT_RE = /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist|watch)|youtu\.be\/)/

function isValidYouTubeUrl(url) {
  return YT_RE.test(url.trim())
}

export default function CreateScreen({ order, onChange, onNext }) {
  const [side, setSide]         = useState('front')
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [urlError, setUrlError] = useState('')
  const debounceRef = useRef(null)

  // QR code generation — debounced
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!order.youtubeUrl || !isValidYouTubeUrl(order.youtubeUrl)) {
      setQrDataUrl(null)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const url = await QRCode.toDataURL(order.youtubeUrl.trim(), {
          width: 180,
          margin: 1,
          color: { dark: '#111111', light: '#ffffff' },
        })
        setQrDataUrl(url)
      } catch {
        setQrDataUrl(null)
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [order.youtubeUrl])

  function handleUrlChange(e) {
    const val = e.target.value
    onChange({ youtubeUrl: val })
    if (val && !isValidYouTubeUrl(val)) {
      setUrlError('Needs a valid YouTube playlist or video URL')
    } else {
      setUrlError('')
    }
  }

  function handleLabelChange(e) {
    onChange({ label: e.target.value.slice(0, 40) })
  }

  function handleNotesChange(e) {
    onChange({ notes: e.target.value.slice(0, 200) })
  }

  const canProceed = order.label.trim() && order.youtubeUrl.trim() && isValidYouTubeUrl(order.youtubeUrl)

  return (
    <div className={styles.screen}>

      {/* ── Left: form ── */}
      <div className={styles.form}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Create Your Tape</h2>
          <p className={styles.formSub}>Fill it in. Watch it come to life.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cassette Label</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Summer 2025 for Jake"
            value={order.label}
            onChange={handleLabelChange}
            maxLength={40}
          />
          <div className={[styles.hint, order.label.length > 32 ? styles.hintWarn : ''].join(' ')}>
            {order.label.length} / 40
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>YouTube Playlist URL</label>
          <input
            className={[styles.input, urlError ? styles.inputError : ''].join(' ')}
            type="url"
            placeholder="https://youtube.com/playlist?list=..."
            value={order.youtubeUrl}
            onChange={handleUrlChange}
          />
          {urlError && <div className={styles.error}>{urlError}</div>}
          {order.youtubeUrl && !urlError && (
            <div className={styles.valid}>✓ Valid YouTube URL</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Personal Note <span className={styles.optional}>(optional)</span></label>
          <textarea
            className={styles.textarea}
            placeholder="A message for the recipient — printed on the back of the card"
            value={order.notes}
            onChange={handleNotesChange}
            maxLength={200}
            rows={3}
          />
          <div className={styles.hint}>{order.notes.length} / 200</div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cassette Color</label>
          <div className={styles.swatches}>
            {COLORS.map(c => (
              <button
                key={c.id}
                className={[styles.swatch, order.color === c.id ? styles.swatchActive : ''].join(' ')}
                style={{ '--swatch-color': c.hex }}
                onClick={() => onChange({ color: c.id })}
                title={c.label}
                aria-label={c.label}
              />
            ))}
          </div>
          <div className={styles.colorName}>
            {COLORS.find(c => c.id === order.color)?.label}
          </div>
        </div>

        <button
          className={styles.nextBtn}
          disabled={!canProceed}
          onClick={onNext}
        >
          Next: Address →
        </button>
      </div>

      {/* ── Right: live preview ── */}
      <div className={styles.preview}>
        <div className={styles.previewTabs}>
          <button
            className={[styles.tab, side === 'front' ? styles.tabActive : ''].join(' ')}
            onClick={() => setSide('front')}
          >Front</button>
          <button
            className={[styles.tab, side === 'back' ? styles.tabActive : ''].join(' ')}
            onClick={() => setSide('back')}
          >Back</button>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.cardScale}>
            {side === 'front'
              ? <CardFront label={order.label} color={order.color} />
              : <CardBack
                  recipientName={order.recipientName}
                  address={order.address}
                  qrDataUrl={qrDataUrl}
                  notes={order.notes}
                />
            }
          </div>
        </div>

        <div className={styles.previewNote}>Live preview · 6" × 4" postcard</div>
      </div>

    </div>
  )
}
