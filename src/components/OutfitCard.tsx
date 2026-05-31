import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY as string | undefined

interface Photo {
  id: string
  url: string
  alt: string
  credit: string
  creditLink: string
}

interface OutfitCardProps {
  id: string
  title: string
  subtitle: string
  query: string
  index: number
}

const LS_KEY = 'kedi_outfits'

function loadProgress(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}
function saveProgress(data: Record<string, boolean>) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

const PLACEHOLDER_BG = [
  'linear-gradient(135deg, #d4ece4 0%, #b8d8cd 100%)',
  'linear-gradient(135deg, #c4ddd5 0%, #d4ece4 100%)',
  'linear-gradient(135deg, #daeee7 0%, #c4ddd5 100%)',
  'linear-gradient(135deg, #b8d8cd 0%, #daeee7 100%)',
]

export default function OutfitCard({ id, title, subtitle, query, index }: OutfitCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [photos, setPhotos] = useState<Photo[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bought, setBought] = useState(() => loadProgress()[id] ?? false)
  const [showCheck, setShowCheck] = useState(false)
  const startX = useRef(0)

  useEffect(() => {
    if (!UNSPLASH_KEY) { setLoading(false); return }
    let cancelled = false
    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=portrait&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (!cancelled && data.results?.length) {
          setPhotos(data.results.map((p: any) => ({
            id: p.id,
            url: p.urls.regular,
            alt: p.alt_description || query,
            credit: p.user.name,
            creditLink: p.user.links.html,
          })))
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query])

  const prev = useCallback(() => setCurrent(c => (c - 1 + Math.max(photos.length, 1)) % Math.max(photos.length, 1)), [photos.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(photos.length, 1)), [photos.length])

  const toggleBought = () => {
    const val = !bought
    setBought(val)
    saveProgress({ ...loadProgress(), [id]: val })
    if (val) { setShowCheck(true); setTimeout(() => setShowCheck(false), 1600) }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.65 }}
      style={{
        borderRadius: 20, overflow: 'hidden',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 24px var(--shadow)',
        position: 'relative',
      }}
    >
      {/* Bought badge */}
      <AnimatePresence>
        {bought && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 20,
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 20,
              background: 'var(--green)', color: '#fff',
              fontSize: '0.72rem', letterSpacing: '0.08em', fontFamily: 'Heebo, sans-serif',
            }}
          >
            <CheckIcon size={11} color="#fff" />
            קנינו?
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image area */}
      <div
        style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', touchAction: 'pan-y' }}
        onTouchStart={e => { startX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - startX.current
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
        }}
      >
        {/* Loading shimmer */}
        {loading && (
          <motion.div
            style={{ position: 'absolute', inset: 0, background: PLACEHOLDER_BG[index % PLACEHOLDER_BG.length] }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* No-key placeholder */}
        {!loading && photos.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            background: PLACEHOLDER_BG[index % PLACEHOLDER_BG.length],
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <p className="font-display" style={{ color: 'var(--text-mid)', fontSize: '1rem', fontStyle: 'italic' }}>
              {subtitle}
            </p>
            <p style={{ color: 'var(--green-light)', fontSize: '0.7rem', letterSpacing: '0.08em', fontFamily: 'Heebo, sans-serif' }}>
              הוסיפי VITE_UNSPLASH_KEY ל-.env
            </p>
          </div>
        )}

        {/* Photos */}
        {!loading && photos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img
                src={photos[current].url}
                alt={photos[current].alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <a
                href={`${photos[current].creditLink}?utm_source=kedi&utm_medium=referral`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  position: 'absolute', bottom: 8, left: 8,
                  fontSize: '0.65rem', padding: '3px 7px', borderRadius: 6,
                  background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(4px)', textDecoration: 'none',
                  fontFamily: 'Heebo, sans-serif',
                }}
              >
                {photos[current].credit} / Unsplash
              </a>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Arrows */}
        {photos.length > 1 && (
          <>
            <NavBtn side="right" onClick={prev} label="הקודמת" />
            <NavBtn side="left" onClick={next} label="הבאה" />
            {/* Dots */}
            <div style={{
              position: 'absolute', bottom: 10, left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: 5, zIndex: 10,
            }}>
              {photos.map((_, i) => (
                <button
                  key={i} onClick={() => setCurrent(i)}
                  aria-label={`תמונה ${i + 1}`}
                  style={{
                    width: i === current ? 16 : 5, height: 5,
                    borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'width 0.2s',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Success overlay */}
        <AnimatePresence>
          {showCheck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,60,40,0.45)', backdropFilter: 'blur(6px)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                <CheckIcon size={56} color="#fff" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.1rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 300 }}>{subtitle}</p>
          <h3
            className="font-display"
            style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </h3>
        </div>

        <motion.button
          onClick={toggleBought}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          aria-label={bought ? 'בטלי סימון' : 'סמני כסודר'}
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '0.55rem 0.9rem', borderRadius: 12, border: 'none',
            background: bought ? 'var(--green)' : 'var(--green-pale)',
            color: bought ? '#fff' : 'var(--green-dark)',
            fontSize: '0.82rem', fontFamily: 'Heebo, sans-serif', fontWeight: 500,
            cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {bought ? <><CheckIcon size={12} color="#fff" />נקנה</> : 'קנינו?'}
        </motion.button>
      </div>
    </motion.div>
  )
}

function NavBtn({ side, onClick, label }: { side: 'left' | 'right'; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [side]: 10, zIndex: 10,
        width: 36, height: 36, borderRadius: '50%', border: 'none',
        background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
    >
      {side === 'right'
        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11L5 7l4-4"/></svg>
        : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
      }
    </button>
  )
}

function CheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3.5 3.5 6.5-8" />
    </svg>
  )
}
