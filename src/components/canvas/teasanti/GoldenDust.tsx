'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = `
attribute float aOffset;
attribute float aPhase;
uniform float uTime;
varying float vAlpha;

void main() {
  vec3 pos = position;

  float t = uTime * 0.12 + aOffset * 7.0;
  // Very gentle Lissajous drift
  pos.x += sin(t * 0.82 + aPhase)        * 0.55;
  pos.y += cos(t * 0.68 + aPhase * 1.3)  * 0.45;
  pos.z += sin(t * 0.94 + aPhase * 0.7)  * 0.50;

  vAlpha = 0.28 + sin(t * 1.4 + aPhase) * 0.14;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (1.4 + sin(t * 2.0) * 0.3) * (220.0 / -mv.z);
  gl_Position  = projectionMatrix * mv;
}
`

const FRAG = `
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = (1.0 - smoothstep(0.0, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(0.85, 0.70, 0.35, a);
}
`

const COUNT = 1200

export default function GoldenDust() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const [positions, offsets, phases] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const off = new Float32Array(COUNT)
    const pha = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // Sphere shell distribution, biased toward camera
      const r     = 2.5 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.6 + 1.5
      pos[i * 3 + 2] = Math.cos(phi) * r * 0.7

      off[i] = Math.random()
      pha[i] = Math.random() * Math.PI * 2
    }

    return [pos, off, pha]
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
        <bufferAttribute args={[offsets,   1]} attach="attributes-aOffset" />
        <bufferAttribute args={[phases,    1]} attach="attributes-aPhase" />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
