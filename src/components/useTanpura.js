import { useCallback, useRef, useState } from 'react'

/*
 * Background music: "Mahiro" murli (bansuri flute) instrumental.
 *
 * If public/music/mahiro-murli.mp3 exists it is played on loop.
 * Otherwise a synthesised bansuri melody over a soft tanpura drone is played,
 * so the invite always has music even without an audio file.
 * The temple bell on opening is kept in both cases.
 */
const TRACK_URL = `${import.meta.env.BASE_URL}music/mahiro-murli.mp3`
const TRACK_VOLUME = 0.6

// Sa = D4. Swar offsets in semitones (Bilawal/Pahadi colour)
const SA = 293.66
const hz = (semi) => SA * Math.pow(2, semi / 12)
const S = 0, R = 2, G = 4, M = 5, P = 7, D = 9, N = 11
const L = (s) => s - 12 // lower octave
const U = (s) => s + 12 // upper octave

// [swar, beats] — slow, folk-wedding style murli phrase (≈ 40 s loop)
const BEAT = 0.42
const MELODY = [
  [P, 2], [D, 1], [P, 1], [G, 2], [R, 1], [G, 1], [P, 4],
  [D, 1], [U(S), 1], [D, 1], [P, 1], [G, 2], [R, 2], [S, 4],
  [L(D), 1], [S, 1], [R, 1], [G, 1], [P, 2], [G, 1], [R, 1], [G, 4],
  [R, 1], [G, 1], [R, 1], [S, 1], [L(D), 2], [L(P), 2], [L(D), 2], [S, 6],
  [G, 1], [P, 1], [D, 2], [U(S), 2], [U(R), 1], [U(S), 1], [D, 4],
  [P, 1], [D, 1], [U(S), 1], [D, 1], [P, 2], [G, 1], [M, 1], [G, 4],
  [R, 1], [G, 1], [P, 2], [G, 1], [R, 1], [S, 2], [R, 2], [L(N), 1], [S, 7],
  [null, 4],
]
const LOOP_SECONDS = MELODY.reduce((t, [, b]) => t + b, 0) * BEAT

export default function useTanpura() {
  const ctxRef = useRef(null)
  const busRef = useRef(null)
  const timerRef = useRef(null)
  const audioRef = useRef(null)
  const useFileRef = useRef(null) // null = unknown, true/false once checked
  const [playing, setPlaying] = useState(false)

  const setup = () => {
    if (ctxRef.current) return ctxRef.current
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    // generated hall reverb
    const len = ctx.sampleRate * 3
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8)
    }
    const verb = ctx.createConvolver()
    verb.buffer = ir
    const wet = ctx.createGain()
    wet.gain.value = 0.5
    master.connect(ctx.destination)
    master.connect(verb).connect(wet).connect(ctx.destination)
    ctxRef.current = ctx
    busRef.current = master
    return ctx
  }

  /* breathy bansuri note with vibrato and a soft glide from the previous note */
  const flute = (freq, prev, when, dur) => {
    const ctx = ctxRef.current
    const out = ctx.createGain()
    const peak = 0.16
    out.gain.setValueAtTime(0, when)
    out.gain.linearRampToValueAtTime(peak, when + 0.08)
    out.gain.setValueAtTime(peak, when + Math.max(0.1, dur - 0.18))
    out.gain.linearRampToValueAtTime(0, when + dur + 0.12)

    const o = ctx.createOscillator()
    o.type = 'sine'
    const o2 = ctx.createOscillator() // a touch of 2nd harmonic for body
    o2.type = 'sine'
    const h2 = ctx.createGain()
    h2.gain.value = 0.12

    const start = prev || freq
    o.frequency.setValueAtTime(start, when)
    o.frequency.exponentialRampToValueAtTime(freq, when + (prev ? 0.09 : 0.01))
    o2.frequency.setValueAtTime(start * 2, when)
    o2.frequency.exponentialRampToValueAtTime(freq * 2, when + (prev ? 0.09 : 0.01))

    // vibrato that blooms on long notes
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 5.2
    const depth = ctx.createGain()
    depth.gain.setValueAtTime(0, when)
    depth.gain.linearRampToValueAtTime(freq * (dur > 1 ? 0.012 : 0.005), when + Math.min(dur, 0.8))
    lfo.connect(depth)
    depth.connect(o.frequency)

    // breath noise
    const nLen = Math.ceil((dur + 0.2) * ctx.sampleRate)
    const nb = ctx.createBuffer(1, nLen, ctx.sampleRate)
    const nd = nb.getChannelData(0)
    for (let i = 0; i < nLen; i++) nd[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = nb
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq * 2
    bp.Q.value = 1.2
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.05, when)
    ng.gain.linearRampToValueAtTime(0.012, when + 0.15)

    o.connect(out)
    o2.connect(h2).connect(out)
    noise.connect(bp).connect(ng).connect(out)
    out.connect(busRef.current)

    const end = when + dur + 0.2
    ;[o, o2, lfo, noise].forEach((n) => {
      n.start(when)
      n.stop(end)
    })
  }

  /* soft tanpura pluck underneath the flute */
  const pluck = (freq, when, gain = 0.05) => {
    const ctx = ctxRef.current
    const out = ctx.createGain()
    out.gain.setValueAtTime(0, when)
    out.gain.linearRampToValueAtTime(gain, when + 0.02)
    out.gain.exponentialRampToValueAtTime(0.0001, when + 4.5)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.Q.value = 5
    lp.frequency.setValueAtTime(freq * 2, when)
    lp.frequency.linearRampToValueAtTime(freq * 7, when + 0.6)
    lp.frequency.exponentialRampToValueAtTime(freq * 2.5, when + 4)
    ;[0, 3.5, -4].forEach((det) => {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = freq
      o.detune.value = det
      o.connect(lp)
      o.start(when)
      o.stop(when + 4.6)
    })
    lp.connect(out).connect(busRef.current)
  }

  const bell = (when) => {
    const ctx = ctxRef.current
    ;[
      [1, 0.25, 5],
      [2.76, 0.12, 3],
      [5.4, 0.06, 1.8],
      [8.93, 0.03, 1],
    ].forEach(([ratio, g, dur]) => {
      const o = ctx.createOscillator()
      const a = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 523.25 * ratio
      a.gain.setValueAtTime(0, when)
      a.gain.linearRampToValueAtTime(g, when + 0.005)
      a.gain.exponentialRampToValueAtTime(0.0001, when + dur)
      o.connect(a).connect(busRef.current)
      o.start(when)
      o.stop(when + dur + 0.1)
    })
  }

  const loop = () => {
    const ctx = ctxRef.current
    const start = ctx.currentTime + 0.1
    // tanpura drone: Pa Sa' Sa' Sa (lower octave) every 3.6 s
    const sa = SA / 2
    for (let t = 0; t < LOOP_SECONDS; t += 3.6) {
      ;[sa * 1.5, sa * 2, sa * 2, sa].forEach((f, i) => pluck(f, start + t + i * 0.9, i === 3 ? 0.06 : 0.045))
    }
    // murli melody
    let t = start + 0.6
    let prev = null
    MELODY.forEach(([swar, beats]) => {
      const dur = beats * BEAT
      if (swar !== null) {
        const f = hz(swar)
        flute(f, prev, t, dur)
        prev = f
      } else prev = null
      t += dur
    })
    timerRef.current = setTimeout(loop, (LOOP_SECONDS + 0.4) * 1000)
  }

  const fadeBus = (to, secs) => {
    const ctx = ctxRef.current
    const now = ctx.currentTime
    busRef.current.gain.cancelScheduledValues(now)
    busRef.current.gain.setValueAtTime(busRef.current.gain.value, now)
    busRef.current.gain.linearRampToValueAtTime(to, now + secs)
  }

  const startSynth = () => {
    fadeBus(0.6, 1.5)
    clearTimeout(timerRef.current)
    loop()
  }

  const startFile = () => {
    if (!audioRef.current) {
      const a = new Audio(TRACK_URL)
      a.loop = true
      a.preload = 'auto'
      audioRef.current = a
    }
    const a = audioRef.current
    a.volume = TRACK_VOLUME
    return a.play()
  }

  const play = useCallback((withBell = false) => {
    const ctx = setup()
    if (ctx) {
      ctx.resume()
      if (withBell) {
        fadeBus(0.6, 0.05)
        bell(ctx.currentTime + 0.05)
        bell(ctx.currentTime + 1.2)
      }
    }
    setPlaying(true)

    if (useFileRef.current === false) {
      if (ctx) startSynth()
      return
    }
    // try the mp3 first (must be called inside the tap for mobile autoplay rules)
    startFile()
      .then(() => {
        useFileRef.current = true
      })
      .catch(() => {
        useFileRef.current = false
        if (ctx) startSynth()
      })
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) audioRef.current.pause()
    if (ctxRef.current) fadeBus(0, 0.8)
    clearTimeout(timerRef.current)
    setPlaying(false)
  }, [])

  return { playing, play, stop, toggle: () => (playing ? stop() : play()) }
}
