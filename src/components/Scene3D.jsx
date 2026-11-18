import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* A cupped, tear-drop petal built from a subdivided plane */
function makePetalGeometry(width = 1, length = 1.4, cup = 0.55, curl = 0.3) {
  const g = new THREE.PlaneGeometry(width, length, 6, 10)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const t = THREE.MathUtils.clamp((y + length / 2) / length, 0, 1) // 0 at base → 1 at tip
    const w = Math.sin(Math.PI * Math.pow(t, 0.75)) * (0.35 + 0.65 * t)
    const nx = x * w
    const z = nx * nx * cup + t * t * curl
    p.setXYZ(i, nx, y + length / 2, z)
  }
  g.computeVertexNormals()
  return g
}

const PETAL_COLORS = ['#ff8f1f', '#ffb52e', '#f2591f', '#c2123d', '#e83e6c', '#ffd36b', '#f7a1b5']

/* Rose / marigold petals falling with sway, spin and scroll-reactive speed */
function FallingPetals({ count, scrollVel }) {
  const mesh = useRef()
  const geo = useMemo(() => makePetalGeometry(1, 1.3, 0.7, 0.35), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloatSpread(26),
        y: THREE.MathUtils.randFloatSpread(22),
        z: THREE.MathUtils.randFloat(-10, 3),
        speed: THREE.MathUtils.randFloat(0.35, 0.9),
        sway: THREE.MathUtils.randFloat(0.3, 1.1),
        phase: Math.random() * Math.PI * 2,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        sx: THREE.MathUtils.randFloat(0.4, 1.4),
        sy: THREE.MathUtils.randFloat(0.4, 1.4),
        s: THREE.MathUtils.randFloat(0.16, 0.32),
      })),
    [count],
  )

  useEffect(() => {
    const c = new THREE.Color()
    data.forEach((_, i) => {
      c.set(PETAL_COLORS[i % PETAL_COLORS.length])
      c.offsetHSL(0, 0, THREE.MathUtils.randFloatSpread(0.08))
      mesh.current.setColorAt(i, c)
    })
    mesh.current.instanceColor.needsUpdate = true
  }, [data])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const boost = 1 + Math.min(Math.abs(scrollVel.current) * 0.02, 6)
    const dir = scrollVel.current < -2 ? -1 : 1
    const d = Math.min(dt, 0.05)
    data.forEach((p, i) => {
      p.y -= p.speed * d * boost * dir
      if (p.y < -11) p.y = 11
      if (p.y > 11) p.y = -11
      p.rx += p.sx * d
      p.ry += p.sy * d * 0.7
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.8, p.y, p.z)
      dummy.rotation.set(p.rx, p.ry, p.rz + Math.sin(t + p.phase) * 0.4)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        roughness={0.55}
        metalness={0.05}
        emissive="#5a1206"
        emissiveIntensity={0.35}
      />
    </instancedMesh>
  )
}

/* Ruffled petal for marigolds */
function makeRuffledPetal() {
  const g = makePetalGeometry(0.75, 0.6, 0.5, 0.25)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const t = y / 0.6
    p.setZ(i, p.getZ(i) + Math.sin(x * 28) * 0.05 * t + Math.sin(x * 11 + 1) * 0.03 * t)
  }
  g.computeVertexNormals()
  return g
}

/* A full 3D marigold: dense ball of ruffled petals arranged by phyllotaxis.
   rel = [x fraction of half-width, y fraction of half-height, z depth] */
function Marigold({ rel, scale = 1, speed = 0.2, hue = 0 }) {
  const group = useRef()
  const mesh = useRef()
  const N = isMobile ? 160 : 260
  const geo = useMemo(() => makeRuffledPetal(), [])
  const { camera, size } = useThree()

  useEffect(() => {
    const dummy = new THREE.Object3D()
    const c = new THREE.Color()
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const f = i / N // 0 = centre, 1 = rim
      const theta = i * golden
      const tilt = THREE.MathUtils.lerp(0.05, 1.85, Math.pow(f, 0.6))
      dummy.position.set(0, 0, 0)
      dummy.rotation.set(0, 0, 0)
      dummy.rotateY(theta)
      dummy.rotateX(tilt)
      dummy.translateY(0.04 + f * 0.1)
      dummy.rotateY((Math.random() - 0.5) * 0.8)
      dummy.scale.setScalar(THREE.MathUtils.lerp(0.35, 1.1, Math.sqrt(f)))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      c.setHSL(0.065 + hue + f * 0.035 + Math.random() * 0.01, 1, THREE.MathUtils.lerp(0.36, 0.5, f) + Math.random() * 0.04)
      mesh.current.setColorAt(i, c)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  }, [N, hue])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    const dist = camera.position.z - rel[2]
    const halfH = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const halfW = halfH * (size.width / size.height)
    group.current.position.set(rel[0] * halfW, rel[1] * halfH + Math.sin(t * 2) * 0.3, rel[2])
    group.current.rotation.x = 1.0 + Math.sin(t * 1.3) * 0.4
    group.current.rotation.z = Math.cos(t) * 0.5
    group.current.rotation.y += 0.003
  })

  return (
    <group ref={group} scale={scale}>
      <instancedMesh ref={mesh} args={[geo, undefined, N]}>
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.75} emissive="#5a1800" emissiveIntensity={0.2} />
      </instancedMesh>
    </group>
  )
}

/* Twinkling gold dust / soft bokeh rendered as shader points */
const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uRise;
  attribute float aScale;
  attribute float aPhase;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * uRise * (0.4 + aScale) + 11.0, 22.0) - 11.0;
    p.x += sin(uTime * 0.3 + aPhase) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vTw = 0.55 + 0.45 * sin(uTime * 2.2 + aPhase * 6.0);
    gl_PointSize = uSize * aScale * (12.0 / -mv.z) * (0.7 + 0.3 * vTw);
    gl_Position = projectionMatrix * mv;
  }
`
const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uSoft;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, uSoft, d);
    gl_FragColor = vec4(uColor, a * uAlpha * vTw);
  }
`

function Dust({ count, color, size, alpha, soft = 0.0, rise = 0.12, spreadZ = [-12, 4] }) {
  const mat = useRef()
  const { geometry, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    const phase = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(30)
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(22)
      pos[i * 3 + 2] = THREE.MathUtils.randFloat(spreadZ[0], spreadZ[1])
      scale[i] = Math.random()
      phase[i] = Math.random() * Math.PI * 2
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    return {
      geometry: g,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size * Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(color) },
        uAlpha: { value: alpha },
        uSoft: { value: soft },
        uRise: { value: rise },
      },
    }
  }, [count, color, size, alpha, soft, rise, spreadZ])

  useFrame((s) => {
    mat.current.uniforms.uTime.value = s.clock.elapsedTime
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* Camera parallax from pointer + gentle drift with scroll position */
function CameraRig({ opened }) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onTilt = (e) => {
      if (e.gamma == null) return
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1)
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('deviceorientation', onTilt)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  useFrame(() => {
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const progress = window.scrollY / scrollMax
    const targetZ = opened.current ? 9 - progress * 3 : 14
    camera.position.x += (pointer.current.x * 1.4 - camera.position.x) * 0.04
    camera.position.y += (-pointer.current.y * 0.9 - camera.position.y) * 0.04
    camera.position.z += (targetZ - camera.position.z) * 0.03
    camera.rotation.z = progress * 0.25
    camera.lookAt(0, 0, -4)
  })
  return null
}

export default function Scene3D({ opened }) {
  const scrollVel = useRef(0)
  useEffect(() => {
    let last = window.scrollY
    let raf
    const tick = () => {
      const y = window.scrollY
      scrollVel.current = scrollVel.current * 0.9 + (y - last) * 0.1 * 10
      last = y
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const petalCount = reduced ? 25 : isMobile ? 70 : 140

  return (
    <div className="scene3d" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, 14], fov: 55, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.75} color="#ffe2c4" />
        <directionalLight position={[6, 8, 6]} intensity={1.6} color="#ffd59a" />
        <pointLight position={[-6, -2, 4]} intensity={30} color="#ff6f91" distance={22} />
        <pointLight position={[0, 4, -6]} intensity={25} color="#ffb347" distance={20} />

        <Dust count={10} color="#ff9fb8" size={260} alpha={0.12} soft={0.0} rise={0.03} spreadZ={[-14, -8]} />
        <Dust count={14} color="#ffc76b" size={200} alpha={0.12} soft={0.0} rise={0.04} spreadZ={[-12, -6]} />
        <Dust count={isMobile ? 350 : 700} color="#ffd98a" size={9} alpha={0.95} rise={0.12} />

        <Marigold rel={[-0.92, 0.62, -6]} scale={isMobile ? 0.9 : 1.25} speed={0.25} />
        <Marigold rel={[0.95, -0.45, -7]} scale={isMobile ? 1 : 1.45} speed={0.2} hue={-0.01} />
        <Marigold rel={[0.8, 0.85, -11]} scale={1.1} speed={0.3} hue={0.015} />
        <Marigold rel={[-0.85, -0.85, -10]} scale={1.2} speed={0.22} hue={0.005} />

        <FallingPetals count={petalCount} scrollVel={scrollVel} />
        <CameraRig opened={opened} />
      </Canvas>
    </div>
  )
}
