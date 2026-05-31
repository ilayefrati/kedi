import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'

// ── Edit your dates here ─────────────────────────────────────────
const FLIGHT_DATE   = new Date('2026-06-05T01:00:00')
const REUNION_DATE  = new Date('2026-08-03T01:30:00')
// ─────────────────────────────────────────────────────────────────

export default function Countdown() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{ padding: '6rem 1.5rem', width: '100%', maxWidth: 640, margin: '0 auto' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <p style={{ color: 'var(--green-mid)', fontSize: '1rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          סופרים ימים
        </p>
        <h2
          className="font-display"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(2rem, 7vw, 3rem)',
            fontWeight: 400, fontStyle: 'italic',
          }}
        >
          שני עוגנים.
        </h2>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <CountdownCard
          title="עד הטיסה שלך"
          subtitle="ההרפתקה מתחילה"
          target={FLIGHT_DATE}
          delay={0.1}
          inView={inView}
          accentColor="var(--green-pale)"
        />
        <CountdownCard
          title="עד שאני מגיע"
          subtitle="כבר סופר"
          target={REUNION_DATE}
          delay={0.22}
          inView={inView}
          accentColor="var(--sand-mid)"
        />
      </div>
    </section>
  )
}

function CountdownCard({
  title, subtitle, target, delay, inView, accentColor,
}: {
  title: string; subtitle: string; target: Date
  delay: number; inView: boolean; accentColor: string
}) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(target)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55 }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '1.75rem 2rem',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 24px var(--shadow)',
      }}
    >
      {/* Accent blob */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: 180, height: 180, borderRadius: '50%',
        background: accentColor, opacity: 0.7,
        filter: 'blur(45px)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.2rem', fontWeight: 400 }}>
          {subtitle}
        </p>
        <h3
          className="font-display"
          style={{ color: 'var(--text)', fontSize: '1.3rem', fontWeight: 500, marginBottom: '1.5rem' }}
        >
          {title}
        </h3>

        {isPast ? (
          <p className="font-display" style={{ color: 'var(--green)', fontSize: '1.5rem', fontStyle: 'italic' }}>
            הגיע הזמן ✦
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
            {[
              { value: days, label: 'ימים' },
              { value: hours, label: 'שעות' },
              { value: minutes, label: 'דקות' },
              { value: seconds, label: 'שניות' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                    fontWeight: 300, color: 'var(--text)',
                    lineHeight: 1, letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(value).padStart(2, '0')}
                </motion.span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.08em' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
