'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Shaders ───────────────────────────────────────────────────────────────
const VERT = /* glsl */ `
  uniform  float uTime;
  uniform  float uSize;
  attribute vec3  aColor;
  attribute float aOffset;
  varying   vec3  vColor;
  varying   float vAlpha;

  void main() {
    vec3 pos = position;

    // Layered wave animation
    float wave = sin(pos.x * 0.28 + uTime * 0.75 + aOffset)       * 0.90
               + cos(pos.z * 0.32 + uTime * 0.55 + aOffset * 1.4) * 0.60;
    pos.y += wave;

    // Slow spiral drift
    float angle = uTime * 0.038 + length(pos.xz) * 0.013;
    float s = sin(angle), c = cos(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = nx; pos.z = nz;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (320.0 / -mv.z);

    vAlpha = 0.35 + 0.65 * abs(sin(uTime * 1.3 + aOffset * 5.8));
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Soft circular sprite with inner glow
    float core = 1.0 - smoothstep(0.0, 0.18, d);
    float halo = 1.0 - smoothstep(0.0, 0.50, d);
    float a    = (core * 0.9 + halo * 0.5) * vAlpha;

    gl_FragColor = vec4(vColor * (1.0 + core * 0.8), a);
  }
`

// ─── Color palette ──────────────────────────────────────────────────────────
const PALETTE = [
  new THREE.Color('#c084fc'),
  new THREE.Color('#818cf8'),
  new THREE.Color('#f0abfc'),
  new THREE.Color('#38bdf8'),
  new THREE.Color('#fb7185'),
  new THREE.Color('#e0f2fe'),
  new THREE.Color('#fca5a5'),
  new THREE.Color('#a5f3fc'),
]

const COUNT = 10_000

export default function ParticleSystem() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const geo       = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const offsets   = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // Radially distributed disk with depth variation
      const r     = Math.pow(Math.random(), 0.45) * 22
      const theta = Math.random() * Math.PI * 2
      const y     = (Math.random() - 0.5) * 12

      positions[i * 3]     = r * Math.cos(theta)
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = r * Math.sin(theta)

      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      colors[i * 3]     = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      offsets[i] = Math.random() * Math.PI * 2
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1))
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uTime: { value: 0 }, uSize: { value: 2.4 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
