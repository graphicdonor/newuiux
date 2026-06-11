'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Tea surface ripple shader ──────────────────────────────────────────── */

const SURF_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const SURF_FRAG = `
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  float ripple = sin(r * 14.0 - uTime * 1.45) * 0.5 + 0.5;
  ripple *= max(0.0, 1.0 - r * 2.1);

  vec3 dark  = vec3(0.28, 0.15, 0.06);
  vec3 mid   = vec3(0.52, 0.35, 0.14);
  vec3 gold  = vec3(0.80, 0.62, 0.25);

  vec3 color = mix(dark, mid, ripple * 0.68);
  float center = max(0.0, 1.0 - r * 4.8) * ripple;
  color = mix(color, gold, center * 0.52);

  // Subtle edge darkening for depth
  color *= 1.0 - smoothstep(0.35, 0.50, r) * 0.45;

  gl_FragColor = vec4(color, 1.0);
}
`

/* ── Cup profile (LatheGeometry: radius, y from base to rim) ────────────── */

const CUP_PROFILE = [
  [0.00, 0.00], // center base — closes the bottom
  [0.18, 0.00], // base outer
  [0.27, 0.03], // foot ring inner
  [0.31, 0.06], // foot ring peak
  [0.27, 0.10], // foot ring inner top
  [0.24, 0.28], // lower body
  [0.26, 0.52], // mid body
  [0.32, 0.74], // upper body flare
  [0.40, 0.90], // shoulder
  [0.43, 0.98], // near rim
  [0.44, 1.04], // rim
].map(([x, y]) => new THREE.Vector2(x, y))

export default function TeaCup() {
  const groupRef = useRef<THREE.Group>(null)
  const surfRef  = useRef<THREE.ShaderMaterial>(null)
  const glowRef  = useRef<THREE.PointLight>(null)

  const cupGeo = useMemo(
    () => new THREE.LatheGeometry(CUP_PROFILE, 52),
    []
  )

  const handleCurve = useMemo(() => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.42, 0.90, 0),
      new THREE.Vector3(0.86, 0.96, 0),
      new THREE.Vector3(0.86, 0.36, 0),
      new THREE.Vector3(0.42, 0.30, 0)
    )
    return new THREE.TubeGeometry(curve, 28, 0.021, 8, false)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y   = Math.sin(t * 0.38) * 0.065
      groupRef.current.rotation.y   = Math.sin(t * 0.11) * 0.09
    }
    if (surfRef.current)  surfRef.current.uniforms.uTime.value = t
    if (glowRef.current)  glowRef.current.intensity = 1.4 + Math.sin(t * 1.25) * 0.22
  })

  return (
    <group ref={groupRef} position={[0, -0.28, 0]}>

      {/* Cup body */}
      <mesh geometry={cupGeo}>
        <meshStandardMaterial
          color="#F4EFE4"
          roughness={0.12}
          metalness={0.04}
        />
      </mesh>

      {/* Handle — curved tube */}
      <mesh geometry={handleCurve}>
        <meshStandardMaterial color="#F4EFE4" roughness={0.14} metalness={0.03} />
      </mesh>

      {/* Gold rim */}
      <mesh position={[0, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.432, 0.012, 8, 52]} />
        <meshStandardMaterial
          color="#c8a050"
          emissive="#d4b483"
          emissiveIntensity={0.55}
          metalness={0.90}
          roughness={0.10}
        />
      </mesh>

      {/* Tea surface — ripple shader */}
      <mesh position={[0, 0.80, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 52]} />
        <shaderMaterial
          ref={surfRef}
          vertexShader={SURF_VERT}
          fragmentShader={SURF_FRAG}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Saucer */}
      <mesh position={[0, -0.075, 0]}>
        <cylinderGeometry args={[0.75, 0.68, 0.065, 52]} />
        <meshStandardMaterial color="#F4EFE4" roughness={0.12} metalness={0.04} />
      </mesh>

      {/* Gold saucer rim */}
      <mesh position={[0, -0.044, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.73, 0.011, 8, 52]} />
        <meshStandardMaterial
          color="#c8a050"
          emissive="#d4b483"
          emissiveIntensity={0.45}
          metalness={0.90}
          roughness={0.10}
        />
      </mesh>

      {/* Warm amber inner glow from tea */}
      <pointLight
        ref={glowRef}
        position={[0, 0.55, 0]}
        color="#d4830a"
        intensity={1.4}
        distance={3.2}
      />

    </group>
  )
}
