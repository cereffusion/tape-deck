import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { CardFront, CardBack } from './CassetteCard.jsx'
import styles from './CreateScreen.module.css'

const COLORS = [
  { id: 'black',  label: 'Classic Black', hex: 'radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a 70%)' },
  { id: 'cream',  label: 'Cream',         hex: 'radial-gradient(circle at 30% 30%, #fff0c8, #d4b878 80%)' },
  { id: 'orange', label: 'Orange',        hex: 'radial-gradient(circle at 30% 30%, #ff7a20, #a83800 80%)' },
  { id: 'blue',   label: 'Blue',          hex: 'radial-gradient(circle at 30% 30%, #3a78ff, #0a1a55 80%)' },
  { id: 'pink',   label: 'Pastel Pink',   hex: 'radial-gradient(circle at 30% 30%, #fcd6dc, #c88090 80%)' },
  { id: 'purple', label: 'Purple',        hex: 'radial-gradient(circle at 30% 30%, #a070ec, #3a0c70 80%)' },
  { id: 'sage',   label: 'Sage Green',    hex: 'radial-gradient(circle at 30% 30%, #b6c4a4, #4e5a3c 80%)' },
]

const BG_COLORS = [
  { id: 'brown', label: 'Warm Brown', hex: 'radial-gradient(circle at 30% 30%, #3a2410, #14100a 80%)' },
  { id: 'black', label: 'Black',      hex: 'radial-gradient(circle at 30% 30%, #1c1c1c, #050505 80%)' },
  { id: 'blue',  label: 'Light Blue', hex: 'radial-gradient(circle at 30% 30%, #d4dfeb, #98aecc 80%)' },
  { id: 'white', label: 'White',      hex: 'radial-gradient(circle at 30% 30%, #ffffff, #ebe2cf 80%)' },
  { id: 'gray',  label: 'Light Gray', hex: 'radial-gradient(circle at 30% 30%, #c8c4be, #989088 80%)' },
]

const YT_RE = /^(https?:\/\/)?(www\.)?(youtube\.com\/(playlist|watch)|youtu\.be\/)/

function isValidYouTubeUrl(url) {
  return YT_RE.test(url.trim())
}

export default function CreateScreen({ order, onChange, onNext }) {
  const [side, setSide]           = useState('front')
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [urlError, setUrlError]   = useState('')
  const [urlValid, setUrlValid]   = useState(null) // null | { type, title }
  const [urlChecking, setUrlChecking] = useState(false)
  const debounceRef = useRef(null)

  // QR + YouTube validation — debounced
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!order.youtubeUrl || !isValidYouTubeUrl(order.youtubeUrl)) {
      setQrDataUrl(null)
      setUrlValid(null)
      setUrlChecking(false)
      return
    }
    setUrlChecking(true)
    setUrlValid(null)
    debounceRef.current = setTimeout(async () => {
      try {
        const [qr, ytRes] = await Promise.all([
          QRCode.toDataURL(order.youtubeUrl.trim(), {
            width: 180, margin: 1,
            color: { dark: '#111111', light: '#ffffff' },
          }),
          fetch(`/api/validate-youtube?url=${encodeURIComponent(order.youtubeUrl.trim())}`).then(r => r.json()),
        ])
        setQrDataUrl(qr)
        if (ytRes.valid) {
          setUrlValid(ytRes)
          setUrlError('')
        } else {
          setUrlValid(null)
          setUrlError(ytRes.error || 'Could not verify this URL')
        }
      } catch {
        setQrDataUrl(null)
        setUrlValid(null)
        setUrlError('Could not verify this URL')
      }
      setUrlChecking(false)
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [order.youtubeUrl])

  function handleUrlChange(e) {
    const val = e.target.value
    onChange({ youtubeUrl: val })
    setUrlValid(null)
    if (val && !isValidYouTubeUrl(val)) {
      setUrlError('Needs a valid YouTube playlist or video URL')
      setUrlChecking(false)
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

  const canProceed = order.label.trim() && urlValid && !urlChecking

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
          {urlChecking && <div className={styles.checking}>Checking...</div>}
          {urlValid && (
            <div className={styles.valid}>✓ {urlValid.type === 'playlist' ? 'Playlist' : 'Video'}: {urlValid.title}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Your Name <span className={styles.optional}>(shown on card back)</span></label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Maria"
            value={order.senderName}
            onChange={e => onChange({ senderName: e.target.value.slice(0, 40) })}
            maxLength={40}
          />
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
                style={{ background: c.hex }}
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

        <div className={styles.field}>
          <label className={styles.label}>Card Background</label>
          <div className={styles.swatches}>
            {BG_COLORS.map(c => (
              <button
                key={c.id}
                className={[styles.swatch, order.cardBg === c.id ? styles.swatchActive : ''].join(' ')}
                style={{ background: c.hex }}
                onClick={() => onChange({ cardBg: c.id })}
                title={c.label}
                aria-label={c.label}
              />
            ))}
          </div>
          <div className={styles.colorName}>
            {BG_COLORS.find(c => c.id === order.cardBg)?.label}
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
              ? <CardFront label={order.label} color={order.color} cassetteId={order.cassetteId} orderNum={order.orderNum} cardBg={order.cardBg} />
              : <CardBack
                  recipientName={order.recipientName}
                  address={order.address}
                  qrDataUrl={qrDataUrl}
                  notes={order.notes}
                  senderName={order.senderName}
                />
            }
          </div>
        </div>

        <div className={styles.previewNote}>Live preview · 6" × 4" postcard</div>
      </div>

    </div>
  )
}
