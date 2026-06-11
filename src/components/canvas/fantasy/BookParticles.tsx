'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = `
attribute float aOffset;
attribute float aSpeed;
attribute vec3 aColor;
uniform float uTime;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // Continuous phase loop per-particle
  float t = mod(uTime * aSpeed * 0.30 + aOffset, 1.0);

  // Spiral: radius bell-curves out then back in as it rises
  float angle  = aOffset * 18.85 + t * 5.5 + uTime * 0.18;
  float radius = t * (1.0 - t) * 4.0 * (1.6 + aSpeed * 0.5);

  pos.x += cos(angle) * radius + sin(uTime * 0.38 + aOffset * 2.6) * 0.3;
  pos.y += t * 12.0 - 0.8;
  pos.z += sin(angle) * radius;

  float fadeIn  = smoothstep(0.0, 0.14, t);
  float fadeOut = 1.0 - smoothstep(0.65, 1.0, t);
  vAlpha = fadeIn * fadeOut * (0.55 + aSpeed * 0.32);
  vColor = aColor;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (1.8 + vAlpha * 5.5) * (290.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float core  = 1.0 - smoothstep(0.0, 0.15, d);
  float outer = 1.0 - smoothstep(0.0, 0.50, d);
  float a = (core * 0.88 + outer * 0.32) * vAlpha;

  gl_FragColor = vec4(vColor * (1.0 + core * 0.9), a);
}
`

const GOLD    = new THREE.Color('#f0c040')
const EMERALD = new THREE.Color('#34d399')
const COUNT   = 2500

export default function BookParticles() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const [positions, offsets, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const off = new Float32Array(COUNT)
    const spd = new Float32Array(COUNT)
    const col = new Float32Array(COUNT * 3)
    const tmp = new THREE.Color()

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const r     = Math.random() * 1.5
      pos[i * 3]     = Math.cos(theta) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.0
      pos[i * 3 + 2] = Math.sin(theta) * r * 0.55

      off[i] = Math.random()
      spd[i] = 0.45 + Math.random() * 1.15

      tmp.copy(Math.random() < 0.68 ? GOLD : EMERALD)
      col[i * 3]     = tmp.r
      col[i * 3 + 1] = tmp.g
      col[i * 3 + 2] = tmp.b
    }

    return [pos, off, spd, col]
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
        <bufferAttribute args={[offsets,   1]} attach="attributes-aOffset" />
        <bufferAttribute args={[speeds,    1]} attach="attributes-aSpeed" />
        <bufferAttribute args={[colors,    3]} attach="attributes-aColor" />
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
