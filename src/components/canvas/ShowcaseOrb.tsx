'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export default function ShowcaseOrb() {
  const orbGroupRef = useRef<THREE.Group>(null)
  const ring1Ref    = useRef<THREE.Mesh>(null)
  const ring2Ref    = useRef<THREE.Mesh>(null)
  const outerGlowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime

    if (orbGroupRef.current) {
      orbGroupRef.current.rotation.y = t * 0.32
      orbGroupRef.current.rotation.x = Math.sin(t * 0.18) * 0.22
      orbGroupRef.current.position.x = THREE.MathUtils.lerp(
        orbGroupRef.current.position.x,
        pointer.x * 0.55,
        0.04
      )
      orbGroupRef.current.position.y = THREE.MathUtils.lerp(
        orbGroupRef.current.position.y,
        pointer.y * 0.32 + Math.sin(t * 0.45) * 0.18,
        0.04
      )
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.14
      ring1Ref.current.rotation.y = t * 0.06
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.09
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.22) * 0.08
    }

    if (outerGlowRef.current) {
      const s = 1 + Math.sin(t * 0.8) * 0.04
      outerGlowRef.current.scale.setScalar(s)
    }
  })

  return (
    <group>
      {/* Outer pulsing glow sphere */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core orb group (moves with mouse) */}
      <group ref={orbGroupRef}>
        {/* Solid distorted core */}
        <mesh>
          <icosahedronGeometry args={[1.48, 1]} />
          <MeshDistortMaterial
            color="#6d28d9"
            emissive="#4c1d95"
            emissiveIntensity={0.6}
            distort={0.38}
            speed={2.2}
            roughness={0.05}
            metalness={0.85}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh scale={1.03}>
          <icosahedronGeometry args={[1.48, 1]} />
          <meshBasicMaterial
            color="#c084fc"
            wireframe
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Inner light */}
        <pointLight color="#a855f7" intensity={4} distance={5} />
        <pointLight color="#ec4899" intensity={1.5} distance={4} position={[1.5, 1, 0]} />
      </group>

      {/* Orbiting ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.55, 0.018, 16, 120]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[3.1, 0.012, 16, 120]} />
        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Particle halo */}
      <Sparkles
        count={90}
        scale={6.5}
        size={2.8}
        speed={0.35}
        color="#c084fc"
        opacity={0.7}
      />
    </group>
  )
}
