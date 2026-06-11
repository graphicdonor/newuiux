'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FLOWER_COUNT = 240
const PETAL_COUNT  = 6

const COLORS = [
  new THREE.Color('#c084fc'),
  new THREE.Color('#e879f9'),
  new THREE.Color('#f0abfc'),
  new THREE.Color('#a78bfa'),
  new THREE.Color('#fb7185'),
  new THREE.Color('#fca5a5'),
  new THREE.Color('#d8b4fe'),
  new THREE.Color('#f9a8d4'),
]

// ── Build a single merged flower geometry (all petals baked in) ──────────
function buildFlowerGeometry() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.20, 0.08, 0.25, 0.48, 0, 0.82)
  shape.bezierCurveTo(-0.25, 0.48, -0.20, 0.08, 0, 0)

  const basePetal = new THREE.ShapeGeometry(shape, 10)
  const basePosArr = basePetal.attributes.position.array as Float32Array
  const baseIdxArr = basePetal.index!.array
  const vtxCount   = basePosArr.length / 3
  const idxCount   = baseIdxArr.length

  const allPos = new Float32Array(vtxCount * PETAL_COUNT * 3)
  const allIdx = new Uint32Array(idxCount * PETAL_COUNT)

  for (let p = 0; p < PETAL_COUNT; p++) {
    const angle = (p / PETAL_COUNT) * Math.PI * 2
    const cosA  = Math.cos(angle)
    const sinA  = Math.sin(angle)

    for (let v = 0; v < vtxCount; v++) {
      const x = basePosArr[v * 3]
      const y = basePosArr[v * 3 + 1]
      allPos[(p * vtxCount + v) * 3]     =  x * cosA - y * sinA
      allPos[(p * vtxCount + v) * 3 + 1] =  x * sinA + y * cosA
      allPos[(p * vtxCount + v) * 3 + 2] =  0
    }

    for (let i = 0; i < idxCount; i++) {
      allIdx[p * idxCount + i] = baseIdxArr[i] + p * vtxCount
    }
  }

  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.BufferAttribute(allPos, 3))
  merged.setIndex(new THREE.BufferAttribute(allIdx, 1))
  merged.computeVertexNormals()
  return merged
}

// ── Per-flower data ──────────────────────────────────────────────────────
interface FlowerDatum {
  x:      number
  y:      number
  z:      number
  scale:  number
  speed:  number
  offset: number
  rotY0:  number
  color:  THREE.Color
}

export default function InstancedFlowers() {
  const petalRef  = useRef<THREE.InstancedMesh>(null)
  const centerRef = useRef<THREE.InstancedMesh>(null)
  const dummy     = useMemo(() => new THREE.Object3D(), [])

  const flowerData = useMemo<FlowerDatum[]>(() => {
    return Array.from({ length: FLOWER_COUNT }, () => {
      const r     = 1.5 + Math.pow(Math.random(), 0.55) * 18
      const theta = Math.random() * Math.PI * 2
      return {
        x:      r * Math.cos(theta),
        y:      (Math.random() - 0.5) * 8,
        z:      r * Math.sin(theta),
        scale:  0.22 + Math.random() * 0.62,
        speed:  0.25 + Math.random() * 0.75,
        offset: Math.random() * Math.PI * 2,
        rotY0:  Math.random() * Math.PI * 2,
        color:  COLORS[Math.floor(Math.random() * COLORS.length)].clone(),
      }
    })
  }, [])

  const { petalGeo, centerGeo } = useMemo(() => ({
    petalGeo:  buildFlowerGeometry(),
    centerGeo: new THREE.SphereGeometry(0.16, 12, 12),
  }), [])

  const petalMat = useMemo(() => new THREE.MeshStandardMaterial({
    side:             THREE.DoubleSide,
    emissive:         new THREE.Color('#8b5cf6'),
    emissiveIntensity: 0.55,
    roughness:        0.45,
    metalness:        0.05,
    transparent:      true,
    opacity:          0.90,
  }), [])

  const centerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:            new THREE.Color('#fbbf24'),
    emissive:         new THREE.Color('#fcd34d'),
    emissiveIntensity: 3.5,
    roughness:        0.2,
    metalness:        0.6,
  }), [])

  // Set per-instance colors once after mount
  useEffect(() => {
    const mesh = petalRef.current
    if (!mesh) return
    flowerData.forEach((f, i) => mesh.setColorAt(i, f.color))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [flowerData])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!petalRef.current || !centerRef.current) return

    for (let f = 0; f < FLOWER_COUNT; f++) {
      const { x, y, z, scale, speed, offset, rotY0 } = flowerData[f]

      const fy   = y + Math.sin(t * speed * 0.38 + offset) * 0.62
      const fx   = x + Math.sin(t * speed * 0.22 + offset * 0.8) * 0.26
      const rotY = rotY0 + t * speed * 0.11

      // Petal mesh
      dummy.position.set(fx, fy, z)
      dummy.rotation.set(0, rotY, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      petalRef.current.setMatrixAt(f, dummy.matrix)

      // Center sphere (slightly elevated, smaller)
      dummy.position.set(fx, fy + scale * 0.04, z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(scale * 0.19)
      dummy.updateMatrix()
      centerRef.current.setMatrixAt(f, dummy.matrix)
    }

    petalRef.current.instanceMatrix.needsUpdate  = true
    centerRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={petalRef}  args={[petalGeo, petalMat, FLOWER_COUNT]} />
      <instancedMesh ref={centerRef} args={[centerGeo, centerMat, FLOWER_COUNT]} />
    </group>
  )
}
