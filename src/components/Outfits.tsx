import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import OutfitCard from './OutfitCard'

// ── Add / edit outfit categories here ─────────────────────────────
const OUTFITS = [
  {
    id: 'friday-camp',
    title: 'לוק לקידוש',
    subtitle: 'יום שישי במחנה',
    query: 'chic casual summer night outfit aesthetic women fashion',
  },
  {
    id: 'party-friends',
    title: 'מסיבה עם חברות',
    subtitle: 'לא להשתגע לי יותר מדי',
    query: 'girls night out party outfit stylish women fashion',
  },
  {
    id: 'dinner-lily',
    title: 'ארוחת ערב עם לילי',
    subtitle: 'אלגנטי ויפה',
    query: 'chic dinner date outfit women elegant summer fashion',
  },
  {
    id: 'shoes-mom',
    title: 'נעליים יפות',
    subtitle: 'גם אמא רצתה לקנות מתנה',
    query: 'trendy women shoes summer fashion aesthetic style',
  },
]
// ─────────────────────────────────────────────────────────────────

export default function Outfits() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      style={{ padding: '6rem 1.5rem', background: 'var(--sand)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <p style={{ color: 'var(--green-mid)', fontSize: '1rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          מה ללבוש
        </p>
        <h2
          className="font-display"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(2rem, 7vw, 3rem)',
            fontWeight: 400, fontStyle: 'italic',
            marginBottom: '0.75rem',
          }}
        >
          הארון לטיול.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 300 }}>
          סמני כל פריט כשקנינו אותו
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          maxWidth: 680,
          margin: '0 auto',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
        }}
      >
        {OUTFITS.map((outfit, i) => (
          <OutfitCard key={outfit.id} {...outfit} index={i} />
        ))}
      </div>
    </section>
  )
}
