import styles from './AddressScreen.module.css'

const FIELDS = [
  { key: 'recipientName', label: 'Recipient Name', placeholder: 'Full name', top: true },
]

const ADDR_FIELDS = [
  { key: 'line1',   label: 'Address Line 1', placeholder: '123 Main Street', wide: true },
  { key: 'line2',   label: 'Address Line 2 (optional)', placeholder: 'Apt, Suite, etc.', wide: true },
  { key: 'city',    label: 'City',           placeholder: 'Brooklyn' },
  { key: 'state',   label: 'State',          placeholder: 'NY' },
  { key: 'zip',     label: 'ZIP Code',       placeholder: '11201' },
]

export default function AddressScreen({ order, onChange, onBack, onNext, error }) {
  function setAddr(key, val) {
    onChange({ address: { ...order.address, [key]: val } })
  }

  function setSenderAddr(key, val) {
    onChange({ senderAddress: { ...order.senderAddress, [key]: val } })
  }

  const addr = order.address
  const canProceed = order.email.trim()
    && order.recipientName.trim()
    && addr.line1.trim() && addr.city.trim() && addr.state.trim() && addr.zip.trim()

  return (
    <div className={styles.screen}>
      <div className={styles.form}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Where's it going?</h2>
          <p className={styles.formSub}>We'll print and mail it directly to them.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Your Email <span className={styles.optional}>(for receipt)</span></label>
          <input
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            value={order.email}
            onChange={e => onChange({ email: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Recipient Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Full name"
            value={order.recipientName}
            onChange={e => onChange({ recipientName: e.target.value })}
          />
        </div>

        {ADDR_FIELDS.map(f => (
          <div className={[styles.field, f.wide ? styles.wide : ''].join(' ')} key={f.key}>
            <label className={styles.label}>{f.label}</label>
            <input
              className={styles.input}
              type="text"
              placeholder={f.placeholder}
              value={addr[f.key] || ''}
              onChange={e => setAddr(f.key, e.target.value)}
            />
          </div>
        ))}

        <div className={styles.senderSection}>
          <div className={styles.senderHeading}>Your Return Address <span className={styles.optional}>(optional — printed as return address)</span></div>
          <div className={styles.field}>
            <label className={styles.label}>Address Line 1</label>
            <input
              className={styles.input}
              type="text"
              placeholder="123 Main Street"
              value={order.senderAddress?.line1 || ''}
              onChange={e => setSenderAddr('line1', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Address Line 2 <span className={styles.optional}>(apt, suite, etc.)</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="Apt 4B"
              value={order.senderAddress?.line2 || ''}
              onChange={e => setSenderAddr('line2', e.target.value)}
            />
          </div>
          <div className={styles.addrRow}>
            <div className={styles.field}>
              <label className={styles.label}>City</label>
              <input className={styles.input} type="text" placeholder="Brooklyn" value={order.senderAddress?.city || ''} onChange={e => setSenderAddr('city', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>State</label>
              <input className={styles.input} type="text" placeholder="NY" value={order.senderAddress?.state || ''} onChange={e => setSenderAddr('state', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>ZIP</label>
              <input className={styles.input} type="text" placeholder="11201" value={order.senderAddress?.zip || ''} onChange={e => setSenderAddr('zip', e.target.value)} />
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={onBack}>← Back</button>
          <button className={styles.nextBtn} disabled={!canProceed} onClick={onNext}>
            Next: Pay & Send →
          </button>
        </div>
      </div>

      <div className={styles.side}>
        <div className={styles.deliveryNote}>
          <div className={styles.deliveryIcon}>📬</div>
          <div className={styles.deliveryText}>
            <strong>Delivered in 5–7 business days</strong>
            <span>Printed and mailed via PostGrid. Real postcard, real stamp.</span>
          </div>
        </div>
        <div className={styles.priceNote}>$5.00 per card — includes printing &amp; postage</div>
      </div>
    </div>
  )
}
