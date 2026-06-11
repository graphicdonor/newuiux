'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PALETTE = ['#c084fc', '#e879f9', '#f0abfc', '#a78bfa', '#fb7185', '#f9a8d4', '#fda4af', '#d8b4fe']

interface FlowerProps {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
  index: number
}

function Flower({ position, color, scale, speed, index }: FlowerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const offset = index * 1.37

  const petalGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.22, 0.08, 0.28, 0.52, 0, 0.88)
    shape.bezierCurveTo(-0.28, 0.52, -0.22, 0.08, 0, 0)
    return new THREE.ShapeGeometry(shape, 18)
  }, [])

  const centerGeo = useMemo(() => new THREE.CircleGeometry(0.14, 24), [])
  const glowGeo   = useMemo(() => new THREE.CircleGeometry(0.52, 32), [])

  const petalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.55,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
      }),
    [color]
  )

  const centerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fbbf24'),
        emissive: new THREE.Color('#fcd34d'),
        emissiveIntensity: 3.0,
      }),
    []
  )

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.055,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color]
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.rotation.z  = Math.sin(t * 0.28 * speed + offset) * 0.18
    groupRef.current.rotation.y += 0.003 * speed
    groupRef.current.position.y  = position[1] + Math.sin(t * 0.38 + offset) * 0.62
    groupRef.current.position.x  = position[0] + Math.sin(t * 0.19 + offset * 0.7) * 0.28
  })

  const PETAL_COUNT = 6

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <mesh
          key={i}
          geometry={petalGeo}
          material={petalMat}
          rotation={[0, 0, (i / PETAL_COUNT) * Math.PI * 2]}
          position={[0, 0, i * 0.002]}
        />
      ))}
      <mesh geometry={centerGeo} material={centerMat} position={[0, 0, 0.025]} />
      <mesh geometry={glowGeo}   material={glowMat}   position={[0, 0, -0.01]} />
    </group>
  )
}

export default function FloatingFlowers() {
  const flowers = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        position: [
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 13,
          (Math.random() - 0.5) * 9 - 1,
        ] as [number, number, number],
        color: PALETTE[i % PALETTE.length],
        scale: 0.28 + Math.random() * 0.72,
        speed: 0.5 + Math.random() * 1.5,
      })),
    []
  )

  return (
    <group>
      {flowers.map((f) => (
        <Flower key={f.id} {...f} index={f.id} />
      ))}
    </group>
  )
}
