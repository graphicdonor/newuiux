'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COLORS = [
  new THREE.Color('#a855f7'),
  new THREE.Color('#ec4899'),
  new THREE.Color('#818cf8'),
  new THREE.Color('#f59e0b'),
  new THREE.Color('#06b6d4'),
  new THREE.Color('#c084fc'),
  new THREE.Color('#f9a8d4'),
]

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const COUNT = 4500

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      // Distribute particles on a sphere shell with some depth variation
      const r     = 10 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.014
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.007) * 0.07
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
        <bufferAttribute args={[colors, 3]}    attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.72}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
