import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/Login'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Photos from './components/Photos'
import Letter from './components/Letter'
import Outfits from './components/Outfits'

const SESSION_KEY = 'kedi_auth'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true')

  useEffect(() => {
    if (authed) sessionStorage.setItem(SESSION_KEY, 'true')
  }, [authed])

  return (
    <AnimatePresence mode="wait">
      {!authed ? (
        <Login key="login" onSuccess={() => setAuthed(true)} />
      ) : (
        <motion.main
          key="site"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: 'var(--sand)', minHeight: '100svh' }}
        >
          <Hero />
          <Countdown />
          <Photos />
          <Letter />
          <Outfits />

          <footer style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <p
              className="font-display"
              style={{ color: 'var(--green-mid)', fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 400 }}
            >
              נעשה עם אהבה, רק בשבילך
            </p>
          </footer>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
