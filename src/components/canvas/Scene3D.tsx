'use client'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Suspense } from 'react'
import FloatingFlowers from './FloatingFlowers'
import ParticleField from './ParticleField'
import CameraRig from './CameraRig'

interface Scene3DProps {
  scrollY: number
}

export default function Scene3D({ scrollY }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.08} />
        <pointLight position={[6, 5, 4]}   color="#7c3aed" intensity={2.2} distance={20} />
        <pointLight position={[-6, -4, -4]} color="#ec4899" intensity={1.6} distance={18} />
        <pointLight position={[0, 0, 3]}   color="#a855f7" intensity={0.9} distance={12} />

        {/* Deep background stars */}
        <Stars
          radius={55}
          depth={35}
          count={2800}
          factor={3}
          fade
          speed={0.4}
          saturation={0.6}
        />

        {/* Particle shell */}
        <ParticleField />

        {/* Procedural magical flowers */}
        <FloatingFlowers />

        {/* Smooth cinematic camera */}
        <CameraRig scrollY={scrollY} />
      </Suspense>
    </Canvas>
  )
}
