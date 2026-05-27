import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { CardFront } from './CassetteCard.jsx'
import styles from './PayScreen.module.css'

export default function PayScreen({ order, onBack, onSuccess }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    }
  }

  return (
    <div className={styles.screen}>

      {/* ── Left: order summary ── */}
      <div className={styles.summary}>
        <div className={styles.summaryHeader}>
          <h2 className={styles.summaryTitle}>Your Order</h2>
        </div>

        <div className={styles.cardPreview}>
          <div className={styles.cardScale}>
            <CardFront label={order.label} color={order.color} cassetteId={order.cassetteId} orderNum={order.orderNum} />
          </div>
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.orderRow}>
            <span className={styles.orderKey}>Label</span>
            <span className={styles.orderVal}>{order.label || '—'}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.orderKey}>Color</span>
            <span className={styles.orderVal} style={{ textTransform: 'capitalize' }}>
              {order.color}
            </span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.orderKey}>To</span>
            <span className={styles.orderVal}>{order.recipientName}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.orderKey}>Address</span>
            <span className={styles.orderVal}>
              {order.address.city}, {order.address.state} {order.address.zip}
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.orderRow}>
            <span className={styles.orderKey}>Print &amp; mail</span>
            <span className={styles.orderVal}>$5.00</span>
          </div>
          <div className={`${styles.orderRow} ${styles.orderTotal}`}>
            <span className={styles.orderKey}>Total</span>
            <span className={styles.orderVal}>$5.00</span>
          </div>
        </div>
      </div>

      {/* ── Right: payment form ── */}
      <div className={styles.payment}>
        <div className={styles.paymentHeader}>
          <h2 className={styles.paymentTitle}>Pay &amp; Send</h2>
          <p className={styles.paymentSub}>Delivered in 5–7 business days</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <PaymentElement />

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!stripe || loading}
          >
            {loading ? 'Processing…' : 'Send It →'}
          </button>
        </form>

        <button className={styles.backBtn} onClick={onBack} disabled={loading}>
          ← Back to address
        </button>
      </div>

    </div>
  )
}
