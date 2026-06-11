'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 70

const VERT = /* glsl */ `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aAmplitude;
  uniform   float uTime;
  varying   float vBright;
  varying   vec3  vColor;

  void main() {
    vec3 pos = position;

    // Independent Lissajous-like drifting per firefly
    float t = uTime * aSpeed + aOffset;
    pos.x += sin(t * 1.28 + aOffset * 2.3) * aAmplitude
           + cos(t * 0.73             ) * aAmplitude * 0.6;
    pos.y += sin(t * 0.87 + aOffset * 1.7) * aAmplitude * 0.75;
    pos.z += cos(t * 1.05 + aOffset * 1.1) * aAmplitude
           + sin(t * 0.52             ) * aAmplitude * 0.55;

    vBright = 0.45 + 0.55 * abs(sin(uTime * aSpeed * 2.8 + aOffset * 3.14));

    // Warm ember to cool ember transition
    vColor = mix(
      vec3(1.0, 0.85, 0.1),   // warm yellow
      vec3(0.55, 1.0, 0.35),  // chartreuse-green
      aOffset / 6.28318
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (10.0 + vBright * 18.0) * (220.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying float vBright;
  varying vec3  vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core  = 1.0 - smoothstep(0.0,  0.12, d);
    float inner = 1.0 - smoothstep(0.08, 0.28, d);
    float halo  = 1.0 - smoothstep(0.15, 0.50, d);
    float alpha = (core * 1.0 + inner * 0.55 + halo * 0.22) * vBright;

    gl_FragColor = vec4(vColor * (1.0 + core * 2.0), alpha);
  }
`

export default function Fireflies() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const geo        = new THREE.BufferGeometry()
    const positions  = new Float32Array(COUNT * 3)
    const offsets    = new Float32Array(COUNT)
    const speeds     = new Float32Array(COUNT)
    const amplitudes = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const r     = 1.5 + Math.random() * 13
      const theta = Math.random() * Math.PI * 2

      positions[i * 3]     = r * Math.cos(theta)
      positions[i * 3 + 1] = -0.5 + Math.random() * 7
      positions[i * 3 + 2] = r * Math.sin(theta)

      offsets[i]    = Math.random() * Math.PI * 2
      speeds[i]     = 0.25 + Math.random() * 0.65
      amplitudes[i] = 0.6 + Math.random() * 1.4
    }

    geo.setAttribute('position',   new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aOffset',    new THREE.BufferAttribute(offsets, 1))
    geo.setAttribute('aSpeed',     new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute('aAmplitude', new THREE.BufferAttribute(amplitudes, 1))
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
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
