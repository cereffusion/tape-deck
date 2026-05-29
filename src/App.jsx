import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CreateScreen  from './components/CreateScreen.jsx'
import AddressScreen from './components/AddressScreen.jsx'
import PayScreen     from './components/PayScreen.jsx'
import ConfirmScreen from './components/ConfirmScreen.jsx'
import AdminScreen   from './components/AdminScreen.jsx'
import styles from './App.module.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const STEPS = ['create', 'address', 'pay']

export default function App() {
  const [step, setStep]               = useState('create')
  const [clientSecret, setClientSecret] = useState(null)
  const [payError, setPayError]       = useState('')
  const [confirmed, setConfirmed]     = useState(false)
  const [order, setOrder] = useState({
    label: '',
    youtubeUrl: '',
    color: 'black',
    cardBg: 'brown',
    notes: '',
    senderName: '',
    email: '',
    cassetteId: String(Math.floor(Math.random() * 90) + 10),
    orderNum:   String(Math.floor(Math.random() * 9000) + 1000),
    recipientName: '',
    address: { line1: '', line2: '', city: '', state: '', zip: '', country: 'US' },
    senderAddress: { line1: '', line2: '', city: '', state: '', zip: '', country: 'US' },
  })

  function updateOrder(patch) {
    setOrder(prev => ({ ...prev, ...patch }))
  }

  async function handleAddressNext() {
    setPayError('')
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setClientSecret(data.clientSecret)
      setStep('pay')
    } catch (err) {
      setPayError(err.message)
    }
  }

  if (window.location.pathname === '/admin') {
    return <AdminScreen />
  }

  if (confirmed) {
    return <ConfirmScreen order={order} />
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Mail-A-Mix</span>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={[
                styles.step,
                s === step ? styles.stepActive : '',
                STEPS.indexOf(step) > i ? styles.stepDone : '',
              ].join(' ')}
            >
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepLabel}>{s}</span>
            </div>
          ))}
        </div>
      </header>

      <main className={styles.main}>
        {step === 'create' && (
          <CreateScreen
            order={order}
            onChange={updateOrder}
            onNext={() => setStep('address')}
          />
        )}

        {step === 'address' && (
          <AddressScreen
            order={order}
            onChange={updateOrder}
            onBack={() => setStep('create')}
            onNext={handleAddressNext}
            error={payError}
          />
        )}

        {step === 'pay' && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary:    '#f0a020',
                  colorBackground: '#1a1a1a',
                  colorText:       '#f0e0c0',
                  colorDanger:     '#e85d04',
                  fontFamily:      "'Space Mono', monospace",
                  borderRadius:    '4px',
                },
              },
            }}
          >
            <PayScreen
              order={order}
              onBack={() => setStep('address')}
              onSuccess={() => setConfirmed(true)}
            />
          </Elements>
        )}
      </main>
    </div>
  )
}
