import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { lazy, Suspense, useRef, useState } from 'react'
import brideLine from './assets/bride-line.png'
import chowkLine from './assets/chowk-line.png'
import ganeshLine from './assets/ganesh-line.png'
import gardenLeft from './assets/garden-left.png'
import gardenMid from './assets/garden-mid.png'
import gardenRight from './assets/garden-right.png'
import groomLine from './assets/groom-line.png'
import Countdown from './components/Countdown'
import Events from './components/Events'
import Gate from './components/Gate'
import { Reveal, SplitText, TiltCard } from './components/Motion'
import { Divider, GoldDefs, Kalash, LineArt, Mandala, Toran } from './components/Ornaments'
import useTanpura from './components/useTanpura'
import {
  baratMapQuery,
  baratNote,
  balManuhar,
  blessing,
  bride,
  ganesh,
  groom,
  reception,
  weddingMoment,
  welcome,
} from './data'
import { downloadICS, mapsUrl } from './utils'

const Scene3D = lazy(() => import('./components/Scene3D'))

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <section className="hero" ref={ref}>
      <Toran className="hero-toran" swags={5} />
      <motion.div className="hero-inner" style={{ y, opacity: fade }}>
        <Reveal>
          <p className="invocation">{blessing.invocation}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="kalash-wrap">
            <Mandala className="kalash-mandala" rings={4} spin={90} />
            <Kalash className="kalash" />
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <blockquote className="couplet">
            {blessing.couplet.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </blockquote>
        </Reveal>
        <Reveal delay={0.45}>
          <div className="greeting">
            <p className="salutation">{blessing.salutation}</p>
            {blessing.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </Reveal>
        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </motion.div>
    </section>
  )
}

function Person({ p, art, side }) {
  return (
    <div className={`person person-${side}`}>
      <Reveal className="portrait-wrap" rotateX={0} y={0}>
        <motion.div
          className="portrait"
          initial={{ rotateY: side === 'left' ? -70 : 70, opacity: 0 }}
          whileInView={{ rotateY: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: [0.16, 0.84, 0.24, 1] }}
        >
          <div className="portrait-frame">
            <LineArt src={art} className="portrait-art" />
          </div>
        </motion.div>
      </Reveal>
      <div className="person-text">
        <h2 className="name">
          <span className="name-title">{p.title}</span> <SplitText text={p.name} delay={0.2} />
        </h2>
        <Reveal delay={0.6}>
          <p className="relation">{p.relation}</p>
          <p className="place">{p.place}</p>
        </Reveal>
      </div>
    </div>
  )
}

function Couple() {
  return (
    <section className="couple">
      <Mandala className="couple-mandala" rings={7} spin={160} />
      <Reveal>
        <p className="eyebrow">The Wedding of</p>
      </Reveal>
      <Divider />
      <Person p={groom} art={groomLine} side="left" />
      <Reveal className="sang" y={0} rotateX={0}>
        <motion.div
          className="heart"
          animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 64 58" aria-hidden="true">
            <path
              d="M32 56 C10 40 2 30 2 18 C2 8 10 2 18 2 C25 2 29 6 32 11 C35 6 39 2 46 2 C54 2 62 8 62 18 C62 30 54 40 32 56Z"
              fill="url(#maroon)"
              stroke="url(#gold)"
              strokeWidth="2.5"
            />
          </svg>
          <span>संग</span>
        </motion.div>
      </Reveal>
      <Person p={bride} art={brideLine} side="right" />
      <Divider />
    </section>
  )
}

function Muhurat() {
  return (
    <section className="muhurat">
      <Reveal>
        <p className="eyebrow">Save the Date</p>
        <h2 className="section-title">शुभ घड़ी की प्रतीक्षा</h2>
        <p className="muhurat-date">
          शुभलग्न · <strong>2 दिसम्बर 2026</strong> · गोधुली बेला
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <Countdown target={weddingMoment} />
      </Reveal>
    </section>
  )
}

function Ganesh() {
  return (
    <section className="ganesh paper-section">
      <TiltCard className="paper" max={5}>
        <div className="paper-inner">
          <p className="invocation dark">{ganesh.invocation}</p>
          <div className="ganesh-row">
            <Reveal className="shloka" delay={0.1}>
              {ganesh.shlokas[0].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </Reveal>
            <motion.div
              className="ganesh-art"
              initial={{ scale: 0.4, opacity: 0, rotateY: 180 }}
              whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 0.84, 0.24, 1] }}
            >
              <div className="halo" />
              <LineArt src={ganeshLine} className="ganesh-line" />
            </motion.div>
            <Reveal className="shloka" delay={0.25}>
              {ganesh.shlokas[1].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </Reveal>
          </div>
        </div>
      </TiltCard>
    </section>
  )
}

function Shagun() {
  return (
    <section className="shagun">
      <Reveal>
        <div className="shagun-head">
          <LineArt src={chowkLine} className="chowk" />
          <div>
            <p className="eyebrow">Wedding Ceremonies</p>
            <h2 className="section-title script">शगुन क्षणिकाएँ</h2>
          </div>
          <LineArt src={chowkLine} className="chowk" />
        </div>
      </Reveal>
      <Reveal delay={0.15} rotateX={40}>
        <Events />
      </Reveal>
    </section>
  )
}

function Reception() {
  return (
    <section className="reception">
      <Reveal rotateX={45}>
        <TiltCard className="velvet" max={8}>
          <div className="velvet-inner">
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
            <p className="eyebrow">{reception.en}</p>
            <h2 className="reception-title">
              <span className="script big">{reception.title}</span>
              <span className="ev">{reception.subtitle}</span>
            </h2>
            <Divider />
            <p className="r-date">{reception.date}</p>
            <p className="r-time">{reception.time}</p>
            <p className="r-label">{reception.venueLabel}</p>
            <p className="r-venue">{reception.venue}</p>
            <p className="r-address">{reception.address}</p>
            <div className="actions">
              <a className="btn" href={mapsUrl(reception.mapQuery)} target="_blank" rel="noreferrer">
                ⌖ मार्ग देखें · Directions
              </a>
              <button
                className="btn ghost"
                onClick={() =>
                  downloadICS({
                    id: 'reception',
                    title: reception.title,
                    en: reception.en,
                    start: reception.start,
                    hours: reception.hours,
                    location: reception.mapQuery,
                    details: reception.address,
                  })
                }
              >
                ✦ कैलेंडर में जोड़ें
              </button>
            </div>
          </div>
        </TiltCard>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="note">
          <span className="note-tag">नोट</span>
          <p>{baratNote}</p>
          <a className="link" href={mapsUrl(baratMapQuery)} target="_blank" rel="noreferrer">
            शिवम् मैरिज गार्डन का मार्ग →
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function Welcome({ onShare }) {
  return (
    <section className="welcome paper-section">
      <div className="paper finale">
        <div className="paper-inner">
          <Reveal>
            <p className="eyebrow dark">With love &amp; blessings</p>
            <div className="parinay">
              <span>के</span>
              <strong>मंगल परिणय</strong>
              <span>के</span>
            </div>
            <div className="welcome-text">
              {welcome.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p>
                <strong className="family">{welcome.family}</strong> {welcome.closing}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="manuhar">
              <p className="manuhar-title">✻ {balManuhar.title} ✻</p>
              {balManuhar.lines.map((l) => (
                <p key={l} className="manuhar-line">
                  {l}
                </p>
              ))}
              <div className="kids">
                {balManuhar.kids.map((k, i) => (
                  <motion.span
                    key={k}
                    className="kid"
                    initial={{ y: 30, opacity: 0, rotate: -10 }}
                    whileInView={{ y: 0, opacity: 1, rotate: (i % 2 ? 4 : -4) }}
                    whileHover={{ y: -6, rotate: 0, scale: 1.08 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.2 + i * 0.1 }}
                  >
                    {k}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <button className="btn share" onClick={onShare}>
              ❤ निमंत्रण साझा करें · Share
            </button>
          </Reveal>
        </div>
        <div className="garden" aria-hidden="true">
          <motion.img
            src={gardenLeft}
            alt=""
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 0.84, 0.24, 1] }}
          />
          <motion.div
            className="garden-mid"
            style={{ backgroundImage: `url(${gardenMid})` }}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.img
            src={gardenRight}
            alt=""
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 0.84, 0.24, 1] }}
          />
        </div>
      </div>
      <p className="footer-line">
        जितेन्द्र <span>❤</span> अंशिका · 02 · 12 · 2026
      </p>
    </section>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const openedRef = useRef(false)
  const music = useTanpura()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  const onOpen = () => {
    openedRef.current = true
    music.play(true)
    setTimeout(() => setOpened(true), 900)
  }

  const onShare = async () => {
    const data = {
      title: 'जितेन्द्र ❤ अंशिका · मंगल परिणय',
      text: 'देथलिया परिवार की ओर से सादर निमंत्रण · शुभलग्न 2 दिसम्बर 2026',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        /* dismissed */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text}\n${data.url}`)}`, '_blank')
    }
  }

  return (
    <>
      <GoldDefs />
      <div className="backdrop" aria-hidden="true" />
      <Suspense fallback={null}>
        <Scene3D opened={openedRef} />
      </Suspense>
      <Gate onOpen={onOpen} />

      {opened && (
        <>
          <motion.div className="progress" style={{ scaleX: progress }} />
          <button
            className={`music ${music.playing ? 'on' : ''}`}
            onClick={music.toggle}
            aria-label={music.playing ? 'संगीत बंद करें' : 'संगीत चलाएँ'}
          >
            <span className="bars">
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
          <main className="content">
            <Hero />
            <Couple />
            <Muhurat />
            <Ganesh />
            <Shagun />
            <Reception />
            <Welcome onShare={onShare} />
          </main>
        </>
      )}
    </>
  )
}
