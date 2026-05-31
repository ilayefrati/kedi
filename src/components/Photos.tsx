import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

// Place files in /public/photos/ and add their paths here
const PHOTOS: { src: string; rotate: number }[] = [
  { src: '/photos/photo1.jpg', rotate: -2.5 },
  { src: '/photos/photo2.jpg', rotate: 2 },
  { src: '/photos/photo3.jpg', rotate: -1.5 },
  { src: '/photos/photo4.jpg', rotate: 3 },
  { src: '/photos/photo7.jpg', rotate: -2 },
  { src: '/photos/photo8.jpg', rotate: 1.5 },
]

const PLACEHOLDERS = [
  { rotate: -2.5, color: '#d4ece4', w: 150, h: 175 },
  { rotate: 2.5,  color: '#c4ddd5', w: 140, h: 160 },
  { rotate: -1.5, color: '#daeee7', w: 160, h: 155 },
  { rotate: 3,    color: '#b8d8cd', w: 145, h: 170 },
]

export default function Photos() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  const items = PHOTOS.length > 0 ? PHOTOS : PLACEHOLDERS.map(p => ({ ...p, src: '' }))

  return (
    <section
      style={{ position: 'relative', padding: '6rem 1.5rem', overflow: 'hidden', background: 'var(--green-mist)' }}
      ref={ref}
    >
      <motion.div
        style={{ y: bgY, position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <div style={{
          position: 'absolute', top: '-15%', right: '55%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--green-pale), transparent 70%)',
          opacity: 0.5, filter: 'blur(60px)',
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative' }}
      >
        <p style={{ color: 'var(--green-mid)', fontSize: '1rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          כמה מהאהובים שלי
        </p>
        <h2
          className="font-display"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(2rem, 7vw, 3rem)',
            fontWeight: 400, fontStyle: 'italic',
          }}
        >
          רגעים לדרך.
        </h2>
      </motion.div>

      {/* Scrapbook — two-column, centered */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          maxWidth: 560,
          margin: '0 auto',
          alignItems: 'start',
          position: 'relative',
        }}
      >
        {items.map((item, i) => {
          const ph = PLACEHOLDERS[i % PLACEHOLDERS.length]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              animate={inView ? { opacity: 1, y: 0, rotate: item.rotate ?? ph.rotate } : {}}
              transition={{ delay: i * 0.1, duration: 0.65, type: 'spring', stiffness: 65 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              style={{
                background: '#ffffff',
                padding: '10px 10px 32px',
                boxShadow: '0 4px 24px rgba(0,50,35,0.1)',
                borderRadius: 3,
                position: 'relative', zIndex: 1,
                cursor: 'default',
                /* alternating vertical offset for scrapbook feel */
                marginTop: i % 2 === 0 ? 0 : '2.5rem',
                justifySelf: 'center',
              }}
            >
              {item.src ? (
                <img
                  src={item.src} alt={item.src}
                  style={{ display: 'block', width: ph.w, height: ph.h, objectFit: 'cover' }}
                  loading="lazy"
                />
              ) : (
                <div style={{
                  width: ph.w, height: ph.h, background: ph.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: 'var(--text-mid)', fontSize: '0.78rem', fontFamily: 'Heebo, sans-serif' }}>
                    הוסיפי תמונה
                  </span>
                </div>
              )}
              <p style={{
                position: 'absolute', bottom: 8, left: 0, right: 0,
                textAlign: 'center', color: 'var(--text-mid)',
                fontSize: '0.78rem', fontFamily: 'Frank Ruhl Libre, serif', fontStyle: 'italic',
              }}>
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
