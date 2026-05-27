import { CardFront } from './CassetteCard.jsx'
import styles from './ConfirmScreen.module.css'

export default function ConfirmScreen({ order }) {
  return (
    <div className={styles.screen}>
      <div className={styles.inner}>

        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>It's in the mail.</h1>
        <p className={styles.sub}>
          Your tape is on its way to {order.recipientName || 'them'}.
        </p>

        <div className={styles.cardWrap}>
          <div className={styles.cardScale}>
            <CardFront label={order.label} color={order.color} cassetteId={order.cassetteId} orderNum={order.orderNum} cardBg={order.cardBg} />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Delivering to</span>
            <span className={styles.detailVal}>
              {order.recipientName}<br />
              {order.address.city}, {order.address.state} {order.address.zip}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailKey}>Estimated arrival</span>
            <span className={styles.detailVal}>5–7 business days</span>
          </div>
        </div>

        <div className={styles.note}>
          Printed and mailed by PostGrid. You'll hear the music playing soon.
        </div>

      </div>
    </div>
  )
}
