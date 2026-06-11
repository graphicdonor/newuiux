'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LEAF_COUNT = 45

function buildLeafGeo(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.quadraticCurveTo( 0.28,  0.18,  0.22, 0.52)
  shape.quadraticCurveTo( 0.08,  0.72,  0.0,  0.88)
  shape.quadraticCurveTo(-0.08,  0.72, -0.22, 0.52)
  shape.quadraticCurveTo(-0.28,  0.18,  0.0,  0.0)
  return new THREE.ShapeGeometry(shape, 8)
}

const PALETTE = [
  new THREE.Color('#1a4a2a'),
  new THREE.Color('#2d6a3a'),
  new THREE.Color('#3d8a28'),
  new THREE.Color('#c8950a'),
  new THREE.Color('#a06a08'),
  new THREE.Color('#7a4505'),
]

export default function FloatingLeaves() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])
  const geo     = useMemo(() => buildLeafGeo(), [])
  const mat     = useMemo(() => new THREE.MeshStandardMaterial({
    vertexColors: true,
    side:         THREE.DoubleSide,
    transparent:  true,
    opacity:      0.85,
    roughness:    0.88,
    metalness:    0.0,
  }), [])

  const leafData = useMemo(() => Array.from({ length: LEAF_COUNT }, () => ({
    x:        (Math.random() - 0.5) * 20,
    y:        (Math.random() - 0.5) * 14,
    z:        (Math.random() - 0.5) * 9,
    speed:    0.10 + Math.random() * 0.22,
    offset:   Math.random() * Math.PI * 2,
    rotSpeed: 0.28 + Math.random() * 0.75,
    scale:    0.32 + Math.random() * 0.58,
  })), [])

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

      const cx = x + Math.sin(t * 0.28 * speed + offset) * 3.2
                   + Math.cos(t * 0.16 * speed + offset * 1.4) * 2.0
      const cy = ((y + t * speed * 1.1 + 7) % 14) - 7
      const cz = z + Math.cos(t * 0.22 * speed + offset) * 2.8

      dummy.position.set(cx, cy, cz)
      dummy.rotation.set(
        Math.sin(t * rotSpeed + offset)           * 0.55,
        t * rotSpeed * 0.22 + offset,
        Math.cos(t * rotSpeed * 0.78 + offset)   * 0.48
      )
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, LEAF_COUNT]} />
  )
}
