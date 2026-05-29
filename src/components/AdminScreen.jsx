import { useState } from 'react'
import styles from './AdminScreen.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()
  let cls = styles.badgeYellow
  if (s === 'mailed' || s === 'delivered') cls = styles.badgeGreen
  if (s === 'failed' || s === 'cancelled') cls = styles.badgeRed
  return <span className={[styles.badge, cls].join(' ')}>{status || '—'}</span>
}

export default function AdminScreen() {
  const [password, setPassword] = useState('')
  const [orders, setOrders]     = useState(null)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function login(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': password },
      })
      if (res.status === 401) { setError('Wrong password.'); setLoading(false); return }
      if (!res.ok) throw new Error('Server error')
      setOrders(await res.json())
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (orders === null) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>MAIL-A-MIX</div>
          <div className={styles.loginSub}>Admin</div>
          <form onSubmit={login} className={styles.loginForm}>
            <input
              className={styles.loginInput}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className={styles.loginError}>{error}</div>}
            <button className={styles.loginBtn} disabled={loading}>
              {loading ? 'Loading…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashHeader}>
        <span className={styles.dashLogo}>MAIL-A-MIX <span className={styles.dashAdmin}>Admin</span></span>
        <span className={styles.dashCount}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</span>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>No orders yet. When cards are ordered they'll appear here.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Label</th>
                <th>Color</th>
                <th>From</th>
                <th>Recipient</th>
                <th>Address</th>
                <th>Email</th>
                <th>PostGrid Status</th>
                <th>Stripe ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className={styles.nowrap}>{formatDate(o.created_at)}</td>
                  <td>{o.cassette_label || '—'}</td>
                  <td>{o.cassette_color || '—'}</td>
                  <td>{o.from_name || '—'}</td>
                  <td>{o.recipient_name || '—'}</td>
                  <td className={styles.addr}>
                    {o.address_line1}
                    {o.address_line2 && <>, {o.address_line2}</>}
                    {(o.city || o.state || o.zip) && <>, {[o.city, o.state, o.zip].filter(Boolean).join(', ')}</>}
                  </td>
                  <td>{o.customer_email || '—'}</td>
                  <td><StatusBadge status={o.postgrid_status} /></td>
                  <td>
                    {o.stripe_payment_id
                      ? <a
                          className={styles.stripeLink}
                          href={`https://dashboard.stripe.com/payments/${o.stripe_payment_id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {o.stripe_payment_id.slice(0, 12)}…
                        </a>
                      : '—'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
