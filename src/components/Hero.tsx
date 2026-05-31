import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PHOTOS: string[] = [
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
]

const PLACEHOLDER_COLORS = ['#d4ece4', '#c4ddd5', '#daeee7', '#b8d8cd']

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '6rem 1.5rem', overflow: 'hidden',
      }}
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 55% at 50% 15%, var(--green-pale) 0%, transparent 70%)',
          opacity: 0.55,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 40% at 15% 85%, var(--sand-mid) 0%, transparent 60%)',
          opacity: 0.5,
        }} />
      </motion.div>

      <motion.div
        style={{
          opacity, position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          width: '100%', maxWidth: 520,
        }}
      >
        <motion.p
          style={{ color: 'var(--green-mid)', fontSize: '1rem', fontWeight: 400, marginBottom: '1rem' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          לפני שאת עוזבת...
        </motion.p>

        <motion.h1
          className="font-display"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(2.8rem, 10vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          בניתי לך<br />
          <span style={{ fontStyle: 'italic', color: 'var(--green)' }}>משהו קטן</span><br />
          לדרך.
        </motion.h1>

        <motion.div
          style={{ width: 36, height: 1.5, background: 'var(--green-pale)', margin: '2rem auto' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />

        <motion.p
          style={{
            color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.75,
            maxWidth: '28ch',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          שלושה חודשים זה הרבה זמן. רציתי לוודא שחלק ממני נוסע איתך.
        </motion.p>

        {/* Polaroids — centered */}
        <motion.div
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          {PHOTOS.length >= 2 ? (
            PHOTOS.slice(0, 2).map((src, i) => (
              <Polaroid key={i} rotate={i === 0 ? -3 : 2.5} delay={1.0 + i * 0.12}>
                <img src={src} alt="" draggable={false} style={{ width: 130, height: 150, objectFit: 'cover', display: 'block', userSelect: 'none' }} />
              </Polaroid>
            ))
          ) : (
            <>
              <Polaroid rotate={-3} delay={1.0}>
                <PlaceholderImg color={PLACEHOLDER_COLORS[0]} label="הוסיפי תמונה" />
              </Polaroid>
              <Polaroid rotate={2.5} delay={1.12}>
                <PlaceholderImg color={PLACEHOLDER_COLORS[1]} label="הוסיפי תמונה" />
              </Polaroid>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll line */}
      <motion.div
        style={{
          position: 'absolute', bottom: 40,
          left: '50%', transform: 'translateX(-50%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, var(--green-pale), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

function Polaroid({ rotate, delay, children }: { rotate: number; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0, y: 20 }}
      animate={{ opacity: 1, rotate, y: 0 }}
      transition={{ delay, duration: 0.7, type: 'spring', stiffness: 70 }}
      whileHover={{ scale: 1.04 }}
      style={{
        background: '#ffffff',
        padding: '10px 10px 30px 10px',
        boxShadow: '0 6px 30px rgba(0,50,35,0.13)',
        borderRadius: 3,
        transformOrigin: 'center bottom',
        position: 'relative', zIndex: 1, cursor: 'default',
        flexShrink: 0,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}

function PlaceholderImg({ color, label }: { color: string; label: string }) {
  return (
    <div style={{
      width: 130, height: 150, background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ color: 'var(--text-mid)', fontSize: '0.78rem', fontFamily: 'Heebo, sans-serif' }}>{label}</span>
    </div>
  )
}
