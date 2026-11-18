import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { events } from '../data'
import { downloadICS } from '../utils'
import { EventIcon } from './Ornaments'

/* 3D coverflow of the five shagun ceremonies */
export default function Events() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const start = useRef(null)
  const n = events.length

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4200)
    return () => clearInterval(id)
  }, [auto, n])

  const go = (i) => {
    setAuto(false)
    setActive(((i % n) + n) % n)
  }

  const onDown = (e) => (start.current = e.clientX)
  const onUp = (e) => {
    if (start.current == null) return
    const dx = e.clientX - start.current
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
    start.current = null
  }

  return (
    <div className="events">
      <div
        className="coverflow"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (start.current = null)}
      >
        {events.map((ev, i) => {
          let d = i - active
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const ad = Math.abs(d)
          return (
            <motion.article
              key={ev.id}
              className={`event-card ${ev.highlight ? 'is-highlight' : ''} ${d === 0 ? 'is-active' : ''}`}
              animate={{
                x: `${d * 58}%`,
                z: -ad * 260,
                rotateY: d * -38,
                opacity: ad > 2 ? 0 : 1 - ad * 0.25,
                scale: d === 0 ? 1 : 0.92,
              }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
              style={{ zIndex: 10 - ad }}
              onClick={() => d !== 0 && go(i)}
              aria-hidden={d !== 0}
            >
              <div className="event-dots">• • • ● ● ● • • •</div>
              <div className="event-icon">
                <EventIcon name={ev.icon} />
              </div>
              <h3>{ev.title}</h3>
              <p className="event-en">{ev.en}</p>
              <p className="event-tithi">{ev.tithi}</p>
              <p className="event-date">{ev.date}</p>
              <p className="event-time">{ev.time}</p>
              {ev.place && <p className="event-place">{ev.place}</p>}
              <button
                className="chip"
                tabIndex={d === 0 ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation()
                  downloadICS({ ...ev, location: ev.place || 'Ujjain', details: `${ev.tithi} ${ev.time}` })
                }}
              >
                ✦ कैलेंडर में जोड़ें
              </button>
            </motion.article>
          )
        })}
      </div>

      <div className="event-nav">
        <button className="nav-arrow" onClick={() => go(active - 1)} aria-label="पिछला">
          ‹
        </button>
        <div className="event-tabs">
          {events.map((ev, i) => (
            <button key={ev.id} className={i === active ? 'on' : ''} onClick={() => go(i)}>
              {ev.title}
            </button>
          ))}
        </div>
        <button className="nav-arrow" onClick={() => go(active + 1)} aria-label="अगला">
          ›
        </button>
      </div>
    </div>
  )
}
