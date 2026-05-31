import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VALID = [
  { user: 'kedi', pass: 'ilayking123' },
]

interface Props { onSuccess: () => void }

export default function Login({ onSuccess }: Props) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const passRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const ok = VALID.some(v => v.user === user.trim().toLowerCase() && v.pass === pass)
    if (ok) {
      setLoading(false)
      onSuccess()
    } else {
      setLoading(false)
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--sand)',
      }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--green-pale) 0%, transparent 70%)',
        opacity: 0.7, filter: 'blur(70px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--sand-mid) 0%, transparent 70%)',
        opacity: 0.8, filter: 'blur(55px)', pointerEvents: 'none',
      }} />

      <motion.div
        style={{ width: '100%', maxWidth: 360 }}
        initial={{ opacity: 0, y: 20 }}
        animate={shake
          ? { x: [0, -10, 10, -7, 7, -4, 4, 0], opacity: 1, y: 0 }
          : { opacity: 1, y: 0, x: 0 }
        }
        transition={shake ? { duration: 0.5 } : { duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <motion.p
          style={{ color: 'var(--green-mid)', fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem', fontWeight: 400 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          משהו קטן שעשיתי בשבילך
        </motion.p>

        <motion.h1
          className="font-display"
          style={{
            color: 'var(--text)', fontSize: 'clamp(2rem, 8vw, 2.8rem)',
            fontWeight: 400, lineHeight: 1.15, textAlign: 'center',
            marginBottom: '2.5rem',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          ברוכה הבאה,{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--green)' }}>קדי.</span>
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '2rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            boxShadow: '0 4px 40px var(--shadow)',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label
              htmlFor="username"
              style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-mid)', fontWeight: 500 }}
            >
             הו אר יו מן?
            </label>
            <input
              id="username" type="text" autoComplete="username"
              value={user}
              onChange={e => { setUser(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && passRef.current?.focus()}
              placeholder="השם שלך"
              style={{
                width: '100%', padding: '0.8rem 1rem',
                borderRadius: 14, outline: 'none',
                border: `1.5px solid ${error ? '#c0392b' : 'var(--border)'}`,
                background: 'var(--sand)', color: 'var(--text)',
                fontFamily: 'Heebo, sans-serif', fontSize: '0.95rem',
                direction: 'rtl', textAlign: 'right',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label
              htmlFor="password"
              style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-mid)', fontWeight: 500 }}
            >
             נחשי מה הסיסמה באמא שלך
            </label>
            <input
              id="password" ref={passRef} type="password"
              autoComplete="current-password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              placeholder="את יודעת"
              style={{
                width: '100%', padding: '0.8rem 1rem',
                borderRadius: 14, outline: 'none',
                border: `1.5px solid ${error ? '#c0392b' : 'var(--border)'}`,
                background: 'var(--sand)', color: 'var(--text)',
                fontFamily: 'Heebo, sans-serif', fontSize: '0.95rem',
                direction: 'rtl', textAlign: 'right',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ fontSize: '0.85rem', textAlign: 'center', color: '#8b3a3a' }}
              >
                משהו לא מסתדר
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || !user || !pass}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            style={{
              marginTop: '0.25rem', padding: '0.9rem',
              borderRadius: 14, border: 'none',
              background: loading ? 'var(--green-pale)' : 'var(--green)',
              color: loading ? 'var(--green-mid)' : '#ffffff',
              fontSize: '0.85rem', letterSpacing: '0.12em',
              fontFamily: 'Heebo, sans-serif', fontWeight: 500,
              cursor: 'pointer', transition: 'opacity 0.2s',
              opacity: (!user || !pass) ? 0.45 : 1,
            }}
          >
            {loading ? <LoadingDots /> : 'כניסה'}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-mid)', display: 'inline-block' }}
        />
      ))}
    </span>
  )
}
