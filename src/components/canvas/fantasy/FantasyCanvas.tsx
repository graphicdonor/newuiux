'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import MagicBook      from './MagicBook'
import BookParticles  from './BookParticles'
import FloatingLeaves from './FloatingLeaves'
import LightBeams     from './LightBeams'
import FantasyPostFX  from './FantasyPostFX'

/* ── Orbital camera with mouse parallax ─────────────────────────────────── */

function FantasyCamera() {
  const { camera } = useThree()
  const mouse  = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    camera.position.set(0, 0, 7.5)
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5)
      target.current.y = (e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime

    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, target.current.x, delta * 1.6)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, target.current.y, delta * 1.6)

    // Gentle figure-8 orbit
    const orbitX = Math.sin(t * 0.10) * 0.9
    const orbitY = Math.cos(t * 0.07) * 0.35 + 0.2

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, orbitX + mouse.current.x * 0.7,  delta * 0.65)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, orbitY - mouse.current.y * 0.45, delta * 0.65)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.5,                              delta * 0.45)

    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ── Canvas wrapper ──────────────────────────────────────────────────────── */

export default function FantasyCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 52, near: 0.1, far: 150 }}
      gl={{
        antialias:       false,
        powerPreference: 'high-performance',
        stencil:         false,
      }}
      dpr={[1, 1.8]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Scene atmosphere */}
        <fogExp2 attach="fog" args={['#030610', 0.035]} />

        {/* Ambient + environment lighting */}
        <ambientLight intensity={0.03} />
        <pointLight position={[ 0,  16,  2]} color="#c8900a" intensity={1.8} distance={35} />
        <pointLight position={[-8,   2, -5]} color="#7c3aed" intensity={1.0} distance={28} />
        <pointLight position={[ 8,  -2,  6]} color="#059669" intensity={0.7} distance={22} />

        {/* Scene objects */}
        <LightBeams />
        <FloatingLeaves />
        <BookParticles />
        <MagicBook />

        {/* Camera */}
        <FantasyCamera />

        {/* Post-processing */}
        <FantasyPostFX />
      </Suspense>
    </Canvas>
  )
}
