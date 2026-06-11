'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying vec2  vUv;

  // ── Smooth value noise ──────────────────────────────────────────────────
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.3 + vec2(3.71, 8.13);
      a *= 0.45;
    }
    return v;
  }

  void main() {
    vec2 uv    = vUv;
    vec2 drift = vec2(uTime * 0.006, uTime * 0.003);

    float fog = fbm(uv * 2.2 + drift) * fbm(uv * 1.4 - drift * 1.5 + 0.7);

    // Soft radial + edge fade
    float radial  = 1.0 - smoothstep(0.0, 0.7, length(uv - 0.5) * 2.0);
    vec2  edges   = 1.0 - abs(uv * 2.0 - 1.0);
    float edgeFade = smoothstep(0.0, 0.28, min(edges.x, edges.y));

    fog = pow(fog, 1.4) * radial * edgeFade;

    float alpha = fog * uOpacity;
    if (alpha < 0.004) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`

interface FogLayerProps {
  y:       number
  size:    number
  opacity: number
  color:   [number, number, number]
  index:   number
}

function FogLayer({ y, size, opacity, color, index }: FogLayerProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Vector3(...color) },
    uOpacity: { value: opacity },
  }), [opacity, color])

  useFrame(({ clock }) => {
    if (matRef.current)
      matRef.current.uniforms.uTime.value = clock.elapsedTime + index * 2.7
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}

const LAYERS: FogLayerProps[] = [
  { y: -2.0, size: 40, opacity: 0.22, color: [0.12, 0.03, 0.28], index: 0 },
  { y:  0.5, size: 46, opacity: 0.15, color: [0.18, 0.04, 0.34], index: 1 },
  { y:  3.0, size: 38, opacity: 0.11, color: [0.08, 0.02, 0.22], index: 2 },
  { y:  6.5, size: 32, opacity: 0.07, color: [0.22, 0.06, 0.38], index: 3 },
]

export default function VolumetricFog() {
  return (
    <group>
      {LAYERS.map((l, i) => (
        <FogLayer key={i} {...l} />
      ))}
    </group>
  )
}
