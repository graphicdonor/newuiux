'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LEAF_COUNT = 22

function buildLeafGeo(): THREE.BufferGeometry {
  // Elongated tea leaf — pointed at both ends
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo( 0.20, 0.12,  0.16, 0.44)
  shape.quadraticCurveTo( 0.06, 0.68,  0.0,  0.82) // tip
  shape.quadraticCurveTo(-0.06, 0.68, -0.16, 0.44)
  shape.quadraticCurveTo(-0.20, 0.12,  0.0,  0.0)
  return new THREE.ShapeGeometry(shape, 10)
}

const PALETTE = [
  new THREE.Color('#142c18'),
  new THREE.Color('#1e4225'),
  new THREE.Color('#183620'),
  new THREE.Color('#264f30'),
  new THREE.Color('#0f2214'),
]

export default function TeaLeaves() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])
  const geo     = useMemo(() => buildLeafGeo(), [])
  const mat     = useMemo(() => new THREE.MeshStandardMaterial({
    vertexColors: true,
    side:         THREE.DoubleSide,
    transparent:  true,
    opacity:      0.88,
    roughness:    0.85,
    metalness:    0.0,
  }), [])

  const leafData = useMemo(() => Array.from({ length: LEAF_COUNT }, (_, i) => {
    // Distribute in a loose cylinder around the scene
    const angle  = (i / LEAF_COUNT) * Math.PI * 2
    const radius = 2.8 + Math.random() * 2.5
    return {
      x:        Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5,
      y:        (Math.random() - 0.5) * 5,
      z:        Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5,
      speed:    0.08 + Math.random() * 0.14,
      offset:   Math.random() * Math.PI * 2,
      rotSpeed: 0.22 + Math.random() * 0.55,
      scale:    0.28 + Math.random() * 0.50,
    }
  }), [])

  useEffect(() => {
    if (!meshRef.current) return
    const c = new THREE.Color()
    for (let i = 0; i < LEAF_COUNT; i++) {
      c.copy(PALETTE[Math.floor(Math.random() * PALETTE.length)])
      meshRef.current.setColorAt(i, c)
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < LEAF_COUNT; i++) {
      const { x, y, z, speed, offset, rotSpeed, scale } = leafData[i]
      const cx = x + Math.sin(t * 0.22 * speed + offset) * 1.8
      const cy = ((y + t * speed * 0.9 + 3) % 8) - 4
      const cz = z + Math.cos(t * 0.18 * speed + offset * 1.2) * 1.6

      dummy.position.set(cx, cy, cz)
      dummy.rotation.set(
        Math.sin(t * rotSpeed + offset) * 0.5,
        t * rotSpeed * 0.20 + offset,
        Math.cos(t * rotSpeed * 0.7 + offset) * 0.4
      )
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geo, mat, LEAF_COUNT]} />
}
