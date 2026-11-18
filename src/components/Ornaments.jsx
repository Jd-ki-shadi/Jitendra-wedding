import { motion } from 'framer-motion'

/* Gold gradient defs reused by every ornament */
export function GoldDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.35" stopColor="#e7b94f" />
          <stop offset="0.6" stopColor="#b9821f" />
          <stop offset="1" stopColor="#f6d77c" />
        </linearGradient>
        <linearGradient id="maroon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f1d34" />
          <stop offset="1" stopColor="#4b0b1b" />
        </linearGradient>
        <radialGradient id="flame" cx="0.5" cy="0.7" r="0.6">
          <stop offset="0" stopColor="#fff6c2" />
          <stop offset="0.5" stopColor="#ffb52e" />
          <stop offset="1" stopColor="#e2401c" />
        </radialGradient>
      </defs>
    </svg>
  )
}

/* Line-art from the original card, painted in gold via CSS mask */
export function LineArt({ src, className = '', style }) {
  return (
    <div
      className={`line-art ${className}`}
      style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, ...style }}
      role="img"
    />
  )
}

export function Divider({ className = '' }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 24" aria-hidden="true">
      <g fill="none" stroke="url(#gold)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M4 12 H78" />
        <path d="M162 12 H236" />
        <path d="M80 12 c8 -10 18 -10 22 0 c-6 6 -12 4 -12 -1" />
        <path d="M160 12 c-8 -10 -18 -10 -22 0 c6 6 12 4 12 -1" />
        <path d="M100 12 c6 -6 14 -6 20 0 c6 -6 14 -6 20 0" />
        <path d="M100 12 c6 6 14 6 20 0 c6 6 14 6 20 0" />
      </g>
      <circle cx="120" cy="12" r="3.2" fill="url(#gold)" />
      <circle cx="4" cy="12" r="1.8" fill="url(#gold)" />
      <circle cx="236" cy="12" r="1.8" fill="url(#gold)" />
    </svg>
  )
}

export function Kalash({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 140" aria-hidden="true">
      <g fill="none" stroke="url(#gold)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {/* mango leaves */}
        {[-50, -28, -8, 8, 28, 50].map((r, i) => (
          <path key={i} transform={`rotate(${r} 60 52)`} d="M60 52 C52 38 54 22 60 12 C66 22 68 38 60 52 Z" />
        ))}
        {/* coconut */}
        <ellipse cx="60" cy="44" rx="15" ry="12" fill="url(#maroon)" />
        <path d="M50 40 q10 -8 20 0" />
        {/* pot */}
        <path d="M38 56 H82 L78 64 C102 74 104 112 78 124 H42 C16 112 18 74 42 64 Z" fill="rgba(120,20,40,0.35)" />
        <path d="M36 56 H84" strokeWidth="4" />
        <path d="M30 92 H90" />
        <path d="M33 100 H87" strokeDasharray="2 5" />
        <path d="M44 124 L40 132 H80 L76 124" />
      </g>
      {/* swastik */}
      <g stroke="url(#gold)" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M60 72 V88 M52 80 H68 M60 72 H68 M68 80 V88 M60 88 H52 M52 80 V72" transform="translate(0 -2)" />
      </g>
      <circle cx="36" cy="80" r="3.5" fill="url(#gold)" />
      <circle cx="84" cy="80" r="3.5" fill="url(#gold)" />
    </svg>
  )
}

/* Procedural mandala that slowly spins behind content */
export function Mandala({ className = '', rings = 6, spin = 120 }) {
  const layers = Array.from({ length: rings }, (_, r) => {
    const radius = 30 + r * 26
    const petals = 8 + r * 4
    return { radius, petals, r }
  })
  return (
    <motion.svg
      className={`mandala ${className}`}
      viewBox="-200 -200 400 400"
      animate={{ rotate: 360 }}
      transition={{ duration: spin, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      <g fill="none" stroke="url(#gold)" strokeWidth="0.9">
        {layers.map(({ radius, petals, r }) => (
          <g key={r} opacity={1 - r * 0.09}>
            <circle r={radius} strokeDasharray={r % 2 ? '2 4' : undefined} />
            {Array.from({ length: petals }, (_, i) => {
              const a = (360 / petals) * i
              const len = 22 + r * 2
              return (
                <path
                  key={i}
                  transform={`rotate(${a}) translate(0 ${-radius})`}
                  d={`M0 0 C ${len * 0.35} ${-len * 0.3} ${len * 0.25} ${-len * 0.8} 0 ${-len} C ${-len * 0.25} ${-len * 0.8} ${-len * 0.35} ${-len * 0.3} 0 0 Z`}
                />
              )
            })}
          </g>
        ))}
        <circle r="18" />
        <circle r="6" fill="url(#gold)" />
      </g>
    </motion.svg>
  )
}

/* Marigold & mango-leaf toran that sways at the top of a section */
export function Toran({ className = '', swags = 5 }) {
  const W = 1000
  const seg = W / swags
  const beads = []
  const drops = []
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 14; i++) {
      const t = i / 14
      const x = s * seg + t * seg
      const y = 10 + Math.sin(Math.PI * t) * 46
      beads.push({ x, y, c: i % 3 === 0 ? '#ffcf3a' : i % 3 === 1 ? '#ff8a1c' : '#f35a1c' })
    }
    drops.push(s * seg)
  }
  drops.push(W)
  return (
    <svg className={`toran ${className}`} viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="1000" height="8" fill="url(#gold)" />
      {beads.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="8" fill={b.c} />
          <circle cx={b.x - 2} cy={b.y - 2} r="3" fill="rgba(255,255,255,0.35)" />
        </g>
      ))}
      {drops.map((x, i) => (
        <g key={i} className="toran-drop" style={{ transformOrigin: `${x}px 8px`, animationDelay: `${i * 0.3}s` }}>
          {Array.from({ length: 7 }, (_, k) => (
            <circle key={k} cx={x} cy={14 + k * 15} r={7 - k * 0.3} fill={k % 2 ? '#ff8a1c' : '#ffcf3a'} />
          ))}
          <path d={`M${x} 118 c-7 8 -7 18 0 26 c7 -8 7 -18 0 -26z`} fill="#4f8a2d" />
        </g>
      ))}
    </svg>
  )
}

/* Small event icons */
export function EventIcon({ name }) {
  const common = { fill: 'none', stroke: 'url(#gold)', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'haldi':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g {...common}>
            <path d="M10 30 H54 C54 44 44 52 32 52 C20 52 10 44 10 30 Z" fill="rgba(255,190,40,0.35)" />
            <path d="M22 52 L20 58 H44 L42 52" />
            <path d="M18 30 c4 -6 10 -6 14 0 c4 -6 10 -6 14 0" />
          </g>
          <g {...common} strokeWidth="1.6">
            <path d="M40 22 c0 -8 6 -12 10 -14 M44 18 c3 0 6 1 8 3" />
            <circle cx="24" cy="18" r="5" />
            <circle cx="24" cy="18" r="1.5" fill="url(#gold)" />
          </g>
        </svg>
      )
    case 'mandap':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g {...common}>
            <path d="M8 22 L32 6 L56 22 Z" fill="rgba(194,18,61,0.3)" />
            <path d="M12 22 V56 M52 22 V56 M24 22 V56 M40 22 V56" />
            <path d="M6 56 H58" />
            <path d="M12 30 q6 6 12 0 q8 6 16 0 q6 6 12 0" />
          </g>
          <circle cx="32" cy="6" r="2.5" fill="url(#gold)" />
        </svg>
      )
    case 'horse':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g {...common}>
            <path d="M18 56 L20 38 C14 34 14 24 22 22 L28 12 L30 18 C38 16 46 22 48 30 L52 40 C52 44 48 44 46 42 L42 36 L40 56" />
            <path d="M26 22 c-2 4 0 8 4 10" />
            <path d="M30 12 c2 -4 6 -6 10 -4" />
            <path d="M28 34 H40" />
          </g>
          <circle cx="40" cy="24" r="1.6" fill="url(#gold)" />
        </svg>
      )
    case 'agni':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path className="flicker" d="M32 8 C40 20 46 26 44 36 C43 42 38 46 32 46 C26 46 21 42 20 36 C19 30 24 26 26 20 C28 26 30 28 32 28 C30 20 30 14 32 8 Z" fill="url(#flame)" />
          <g {...common}>
            <path d="M10 46 H54 L48 56 H16 Z" fill="rgba(194,18,61,0.3)" />
            <path d="M14 46 L20 40 M50 46 L44 40" />
          </g>
        </svg>
      )
    default: // diya for puja
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path className="flicker" d="M32 10 C37 18 38 24 32 30 C26 24 27 18 32 10 Z" fill="url(#flame)" />
          <g {...common}>
            <path d="M8 36 C14 50 50 50 56 36 Z" fill="rgba(255,170,40,0.3)" />
            <path d="M20 48 L18 54 H46 L44 48" />
            <path d="M32 30 V36" />
          </g>
        </svg>
      )
  }
}
