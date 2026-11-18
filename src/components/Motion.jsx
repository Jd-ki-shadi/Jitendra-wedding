import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ease = [0.16, 0.84, 0.24, 1]

/* Section content that swings up in 3D as it scrolls into view */
export function Reveal({ children, delay = 0, className = '', as = 'div', y = 50, rotateX = 28 }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, rotateX, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, delay, ease }}
      style={{ transformPerspective: 900, transformOrigin: '50% 100%' }}
    >
      {children}
    </M>
  )
}

/* Letter-by-letter reveal that respects Devanagari clusters */
export function SplitText({ text, className = '', delay = 0, stagger = 0.06 }) {
  const seg =
    typeof Intl !== 'undefined' && Intl.Segmenter
      ? [...new Intl.Segmenter('hi', { granularity: 'grapheme' }).segment(text)].map((s) => s.segment)
      : [...text]
  return (
    <span className={`split ${className}`} aria-label={text}>
      {seg.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: '0.6em', rotateY: 90 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: delay + i * stagger, ease }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/* Card that tilts toward the pointer with a moving glare */
export function TiltCard({ children, className = '', max = 10, ...rest }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 150, damping: 18 })
  const sy = useSpring(my, { stiffness: 150, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      {...rest}
    >
      {children}
      <motion.div className="glare" style={{ '--gx': glareX, '--gy': glareY }} />
    </motion.div>
  )
}
