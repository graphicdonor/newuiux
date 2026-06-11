'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import TeaCup       from './TeaCup'
import SteamParticles from './SteamParticles'
import GoldenDust   from './GoldenDust'
import TeaLeaves    from './TeaLeaves'
import TeaPostFX    from './TeaPostFX'

/* ── Camera — gentle sway with mouse parallax ───────────────────────────── */

function TeaCamera() {
  const { camera } = useThree()
  const mouse  = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    camera.position.set(0, 1.6, 5.8)
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5)
      target.current.y = (e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, target.current.x, delta * 1.4)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, target.current.y, delta * 1.4)

    const bx = Math.sin(t * 0.07) * 0.55
    const by = 1.6 + Math.sin(t * 0.05) * 0.18

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, bx + mouse.current.x * 0.55, delta * 0.60)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, by - mouse.current.y * 0.38, delta * 0.60)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.8,                          delta * 0.40)
    camera.lookAt(0, 0.72, 0)
  })

  return null
}

/* ── Canvas wrapper ──────────────────────────────────────────────────────── */

export default function TeaScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 5.8], fov: 48, near: 0.1, far: 120 }}
      gl={{
        antialias:       false,
        powerPreference: 'high-performance',
        stencil:         false,
      }}
      dpr={[1, 1.8]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Warm atmospheric fog */}
        <fogExp2 attach="fog" args={['#0a1a12', 0.030]} />

        {/* ── Lighting — golden sunrise palette ───────────────────────── */}
        <ambientLight intensity={0.06} color="#d4b483" />

        {/* Key light: golden sunrise from upper-right */}
        <directionalLight
          position={[4, 8, 3]}
          color="#ffcc66"
          intensity={2.8}
          castShadow={false}
        />

        {/* Fill light: soft forest green from left */}
        <pointLight position={[-5, 3, 2]}  color="#2e5a48" intensity={1.2} distance={18} />

        {/* Rim light: warm amber from behind */}
        <pointLight position={[1, 4, -5]}  color="#d4830a" intensity={1.0} distance={15} />

        {/* Ground ambient bounce */}
        <pointLight position={[0, -1, 3]}  color="#c8a060" intensity={0.55} distance={10} />

        {/* ── Scene objects ──────────────────────────────────────────── */}
        <GoldenDust />
        <TeaLeaves />
        <TeaCup />
        <SteamParticles />

        {/* ── Camera & post ──────────────────────────────────────────── */}
        <TeaCamera />
        <TeaPostFX />
      </Suspense>
    </Canvas>
  )
}
