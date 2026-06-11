'use client'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import ShowcaseOrb from './ShowcaseOrb'

export default function ShowcaseCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.06} />
        <ShowcaseOrb />
      </Suspense>
    </Canvas>
  )
}
