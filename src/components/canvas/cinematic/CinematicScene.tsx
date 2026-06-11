'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ParticleSystem   from './ParticleSystem'
import InstancedFlowers from './InstancedFlowers'
import Fireflies        from './Fireflies'
import VolumetricFog    from './VolumetricFog'
import PostProcessing   from './PostProcessing'
import CinematicCamera  from './CinematicCamera'

export default function CinematicScene() {
  return (
    <Canvas
      camera={{ position: [0, 3, 14], fov: 55, near: 0.1, far: 200 }}
      gl={{
        antialias:        false,   // disabled — MSAA conflicts with postprocessing
        powerPreference:  'high-performance',
        stencil:          false,
      }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: '#020008' }}
    >
      <Suspense fallback={null}>
        {/* ── Scene fog ──────────────────────────────────────────────── */}
        <fogExp2 attach="fog" args={['#060012', 0.028]} />

        {/* ── Lighting ───────────────────────────────────────────────── */}
        <ambientLight intensity={0.04} />
        <pointLight position={[ 0,  12,  0]} color="#7c3aed" intensity={2.2} distance={40} />
        <pointLight position={[-9,   4, -9]} color="#ec4899" intensity={1.4} distance={30} />
        <pointLight position={[ 9,  -1,  9]} color="#0ea5e9" intensity={1.0} distance={25} />
        <pointLight position={[ 0,   2,  0]} color="#a855f7" intensity={0.8} distance={15} />

        {/* ── Scene objects ──────────────────────────────────────────── */}
        <ParticleSystem />
        <InstancedFlowers />
        <Fireflies />
        <VolumetricFog />

        {/* ── Camera rig ─────────────────────────────────────────────── */}
        <CinematicCamera />

        {/* ── Post-processing pipeline ───────────────────────────────── */}
        <PostProcessing />
      </Suspense>
    </Canvas>
  )
}
