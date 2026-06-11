'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = `
attribute float aOffset;
attribute float aSpeed;
uniform float uTime;
varying float vAlpha;
varying float vSize;

void main() {
  vec3 pos = position;

  float t = mod(uTime * aSpeed * 0.18 + aOffset, 1.0);

  // Horizontal wisp drift
  float wigX = sin(t * 9.0  + aOffset * 5.8) * 0.10 * t;
  float wigZ = cos(t * 7.5  + aOffset * 4.2) * 0.08 * t;
  // Gentle overall sway
  float swayX = sin(uTime * 0.28 + aOffset * 2.2) * 0.05;

  pos.x += wigX + swayX;
  pos.y += t * 3.8 + 0.05;
  pos.z += wigZ;
  // Expand outward as it rises
  pos.xz *= 1.0 + t * 0.55;

  float fadeIn  = smoothstep(0.0, 0.12, t);
  float fadeOut = 1.0 - smoothstep(0.55, 1.0, t);
  vAlpha = fadeIn * fadeOut * 0.38;
  vSize  = 4.0 + t * 18.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = vSize * (260.0 / -mv.z);
  gl_Position  = projectionMatrix * mv;
}
`

const FRAG = `
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  // Soft gaussian disc
  float a = exp(-d * d * 9.0) * vAlpha;
  // Slight warm tint to steam
  vec3 color = mix(vec3(0.92, 0.88, 0.82), vec3(1.0, 0.98, 0.95), d);

  gl_FragColor = vec4(color, a);
}
`

const COUNT = 600

export default function SteamParticles() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const [positions, offsets, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const off = new Float32Array(COUNT)
    const spd = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // Emit from inside the cup rim (radius ≤ 0.35)
      const theta = Math.random() * Math.PI * 2
      const r     = Math.random() * 0.30
      pos[i * 3]     = Math.cos(theta) * r
      pos[i * 3 + 1] = 1.05 // just above cup rim
      pos[i * 3 + 2] = Math.sin(theta) * r

      off[i] = Math.random()
      spd[i] = 0.55 + Math.random() * 0.85
    }

    return [pos, off, spd]
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
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
