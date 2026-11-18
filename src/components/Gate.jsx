import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import ganeshLine from '../assets/ganesh-line.png'
import { LineArt, Toran } from './Ornaments'

function DoorPanel({ side }) {
  return (
    <div className={`door door-${side}`}>
      <div className="door-face">
        <div className="door-arch" />
        <div className="door-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="door-tile">
              <span />
            </div>
          ))}
        </div>
        <div className="door-studs" />
        <div className="door-ring">
          <span />
        </div>
      </div>
      <div className="door-edge" />
    </div>
  )
}

export default function Gate({ onOpen }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const open = () => {
    if (opening) return
    setOpening(true)
    onOpen()
    setTimeout(() => setGone(true), 2600)
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className={`gate ${opening ? 'is-opening' : ''}`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="gate-glow" />
          <div className="gate-stage">
            <DoorPanel side="left" />
            <DoorPanel side="right" />
          </div>
          <Toran className="gate-toran" swags={4} />

          <motion.div
            className="gate-center"
            animate={opening ? { opacity: 0, scale: 0.6, y: 30 } : { opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: opening ? 0.5 : 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="gate-om">॥ जय श्री महाकाल ॥</p>
            <button className="seal" onClick={open} aria-label="निमंत्रण खोलें — Open invitation">
              <span className="seal-ring" />
              <LineArt src={ganeshLine} className="seal-ganesh" />
              <span className="seal-initials">
                जि <i>❤</i> अं
              </span>
            </button>
            <p className="gate-cta">
              निमंत्रण खोलें
              <small>Tap the seal to open</small>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
