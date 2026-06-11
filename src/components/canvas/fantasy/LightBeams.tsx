'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = `
varying vec2 vUv;
uniform float uOpacity;

void main() {
  // Fade from bright base (near book) to transparent tip
  float vert  = pow(1.0 - vUv.y, 0.65);
  // Soft horizontal fade — bright center, transparent edges
  float horiz = 1.0 - smoothstep(0.0, 0.5, abs(vUv.x - 0.5) * 2.4);
  float a = vert * horiz * uOpacity;
  // Warm amber-gold beam color
  vec3 color = mix(vec3(0.92, 0.68, 0.14), vec3(0.75, 0.52, 0.08), vUv.y);
  gl_FragColor = vec4(color, a);
}
`

const ROTATIONS = [-0.08, 0.20, -0.34, 0.52, -0.65, 0.80, -1.02, 1.20]

function Beam({ rotZ, offset }: { rotZ: number; offset: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uOpacity.value =
        0.052 + Math.sin(clock.elapsedTime * 0.52 + offset) * 0.020
    }
  })

  return (
    <mesh position={[0, 5.5, 0]} rotation={[0, 0, rotZ]}>
      <planeGeometry args={[0.85, 11, 1, 6]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uOpacity: { value: 0.052 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function LightBeams() {
  return (
    <group position={[0, 0, -0.4]}>
      {ROTATIONS.map((rotZ, i) => (
        <Beam key={i} rotZ={rotZ} offset={i * 0.88} />
      ))}
    </group>
  )
}
