import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Edit the letter here ──────────────────────────────────────────
const LETTER_DATE = 'מאי 2026'
const LETTER_LINES = [
  'לקדי שלי',
  '',
  'אני לא כזה מעכל שאת טסה לי לחודשיים. מצד אחד אני עצוב כי אני לא מכיר מה זה לא לראות אותך כל היום, אבל מצד שני אני כלכך שמח בשבילך.',
  '',
  'כלכך מגיע לך להנות ולעשות משהו משמעותי כזה, כמו שתמיד רצית. אין לי ספק שאת תפרחי שם ושיהיה לך הכי טוב בעולם.',
  '',
  'כמובן שלא נשכח שאני זוכה לראות אותך חודש לפני כולם ואנחנו עומדים לכבוש את ארצות הבריתתת. אבל עד אז, תהני מהבגדים היפים שקנינו לך.',
  '',
  'אוהב הכי בעולם, לילי שלך :)',
]
// ─────────────────────────────────────────────────────────────────

export default function Letter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      style={{ padding: '6rem 1.5rem', background: 'var(--surface)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <h2
          className="font-display"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(2rem, 7vw, 3rem)',
            fontWeight: 400, fontStyle: 'italic',
          }}
        >
          מכתב קטן לקדי שלי
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.65 }}
        style={{
          maxWidth: 520,
          margin: '0 auto',
          background: '#fefcf7',
          borderRadius: 4,
          padding: 'clamp(1.75rem, 5vw, 2.75rem)',
          boxShadow: '0 2px 40px rgba(0,50,35,0.07), 0 1px 3px rgba(0,50,35,0.04)',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        {/* Subtle ruled lines */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 4, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, var(--green-mist) 27px, var(--green-mist) 28px)',
          backgroundPositionY: 52,
          opacity: 0.6,
        }} />

        {/* Left border accent */}
        <div style={{
          position: 'absolute', top: '2rem', bottom: '2rem', right: '2rem',
          width: 2, background: 'var(--green-pale)', borderRadius: 2,
          opacity: 0.7,
        }} />

        <motion.p
          style={{
            color: 'var(--text-muted)', fontSize: '0.9rem',
            fontFamily: 'Frank Ruhl Libre, serif', fontStyle: 'italic',
            marginBottom: '1.5rem', position: 'relative',
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {LETTER_DATE}
        </motion.p>

        <div style={{ position: 'relative' }}>
          {LETTER_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.045, duration: 0.45 }}
              style={{
                fontFamily: 'Frank Ruhl Libre, serif',
                fontWeight: 400,
                fontSize: 'clamp(1rem, 2.8vw, 1.1rem)',
                lineHeight: 1.8,
                color: line === '' ? undefined : 'var(--text)',
                minHeight: line === '' ? '1.2rem' : undefined,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          style={{ marginTop: '2rem', position: 'relative' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.85 }}
        >
          <div style={{ width: 32, height: 1, background: 'var(--border)', marginBottom: '0.75rem' }} />

        </motion.div>
      </motion.div>
    </section>
  )
}
