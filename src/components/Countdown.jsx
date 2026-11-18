import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function diff(target) {
  const ms = Math.max(0, target - Date.now())
  return {
    done: ms === 0,
    parts: [
      ['दिन', 'Days', Math.floor(ms / 864e5)],
      ['घंटे', 'Hours', Math.floor(ms / 36e5) % 24],
      ['मिनट', 'Minutes', Math.floor(ms / 6e4) % 60],
      ['सेकंड', 'Seconds', Math.floor(ms / 1e3) % 60],
    ],
  }
}

function FlipNumber({ value }) {
  const v = String(value).padStart(2, '0')
  return (
    <span className="flip">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={v}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.3, 0.8, 0.3, 1] }}
          style={{ display: 'inline-block', transformOrigin: '50% 50% -20px' }}
        >
          {v}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Countdown({ target }) {
  const [state, setState] = useState(() => diff(target))
  useEffect(() => {
    const id = setInterval(() => setState(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (state.done) return <p className="countdown-done">शुभ विवाह सम्पन्न · आशीर्वाद हेतु धन्यवाद</p>

  return (
    <div className="countdown">
      {state.parts.map(([hi, en, n]) => (
        <div className="cd-cell" key={en}>
          <FlipNumber value={n} />
          <span className="cd-label">
            {hi}
            <small>{en}</small>
          </span>
        </div>
      ))}
    </div>
  )
}
