'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Arcane rune shader ─────────────────────────────────────────────────── */

const RUNE_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const RUNE_FRAG = `
uniform float uTime;
varying vec2 vUv;

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa,ba) / dot(ba,ba), 0.0, 1.0));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float t = uTime;
  float g = 0.0;
  float W = 0.023;

  // Outer ring
  g += 1.00 * (1.0 - smoothstep(0.0, W,       abs(r - 0.80)));
  // Middle ring
  g += 0.72 * (1.0 - smoothstep(0.0, W * 0.88, abs(r - 0.53)));
  // Inner ring
  g += 0.50 * (1.0 - smoothstep(0.0, W * 0.72, abs(r - 0.26)));

  // 8 spokes from inner to outer ring
  for (int i = 0; i < 8; i++) {
    float ang = float(i) * 0.785398;
    vec2 d = vec2(cos(ang), sin(ang));
    g += 0.60 * (1.0 - smoothstep(0.0, 0.016, sdSeg(uv, d * 0.28, d * 0.78)));
  }

  // Slowly rotating 4-arm cross inside inner ring
  float spin = t * 0.38;
  for (int i = 0; i < 4; i++) {
    float ang = float(i) * 1.5707963 + spin;
    vec2 d = vec2(cos(ang), sin(ang));
    g += 0.44 * (1.0 - smoothstep(0.0, 0.018, sdSeg(uv, vec2(0.0), d * 0.24)));
  }

  // 16 outer tick marks
  for (int i = 0; i < 16; i++) {
    float ang = float(i) * 0.392699;
    vec2 d = vec2(cos(ang), sin(ang));
    g += 0.28 * (1.0 - smoothstep(0.0, 0.013, sdSeg(uv, d * 0.73, d * 0.87)));
  }

  // Pulsing + radial ripple
  float pulse = 0.66 + 0.34 * sin(t * 1.9 + r * 5.8);

  // Gold (center) blending toward emerald (outer edge)
  float ct     = smoothstep(0.30, 0.82, r);
  vec3 gold    = vec3(0.92, 0.75, 0.18);
  vec3 emerald = vec3(0.22, 0.84, 0.46);
  vec3 color   = mix(gold, emerald, ct * 0.38);

  float alpha = clamp(g * pulse, 0.0, 1.0);
  if (alpha < 0.015) discard;
  gl_FragColor = vec4(color * (1.1 + pulse * 0.55), alpha);
}
`

/* ── Rune decal plane on front cover ────────────────────────────────────── */

function RuneDecal() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh position={[0, 0, 0.165]}>
      <planeGeometry args={[2.0, 2.0, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={RUNE_VERT}
        fragmentShader={RUNE_FRAG}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ── Book dimensions ────────────────────────────────────────────────────── */

const W     = 2.8   // width
const H     = 3.8   // height
const THICK = 0.50  // total thickness
const CV    = 0.08  // cover plate thickness

const GOLD_MAT_PROPS = {
  color:             '#8b6a00',
  emissive:          '#d4a017',
  emissiveIntensity: 0.95,
  metalness:         0.92,
  roughness:         0.18,
}

/* ── Main book component ────────────────────────────────────────────────── */

export default function MagicBook() {
  const bookRef    = useRef<THREE.Group>(null)
  const glowRef    = useRef<THREE.PointLight>(null)
  const glowSphere = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!bookRef.current) return
    bookRef.current.position.y   = Math.sin(t * 0.42) * 0.24
    bookRef.current.rotation.y   = Math.sin(t * 0.14) * 0.14
    bookRef.current.rotation.z   = Math.sin(t * 0.19) * 0.032

    if (glowRef.current) {
      glowRef.current.intensity = 3.2 + Math.sin(t * 1.8) * 0.7
    }
    if (glowSphere.current) {
      glowSphere.current.opacity = 0.025 + Math.sin(t * 1.1) * 0.008
    }
  })

  return (
    <group ref={bookRef} position={[0, -0.6, 0]}>

      {/* Back cover */}
      <mesh position={[0, 0, -(THICK / 2 - CV / 2)]}>
        <boxGeometry args={[W, H, CV]} />
        <meshStandardMaterial color="#0a0605" roughness={0.82} metalness={0.12} />
      </mesh>

      {/* Pages block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W - 0.1, H - 0.06, THICK - CV * 2]} />
        <meshStandardMaterial
          color="#e0cfa0"
          roughness={0.94}
          metalness={0.0}
          emissive="#b08040"
          emissiveIntensity={0.20}
        />
      </mesh>

      {/* Front cover */}
      <mesh position={[0, 0, THICK / 2 - CV / 2]}>
        <boxGeometry args={[W, H, CV]} />
        <meshStandardMaterial color="#0c0706" roughness={0.72} metalness={0.18} />
      </mesh>

      {/* Gold edge borders */}
      <mesh position={[0, H / 2 - 0.04, 0]}>
        <boxGeometry args={[W + 0.06, 0.09, THICK + 0.06]} />
        <meshStandardMaterial {...GOLD_MAT_PROPS} />
      </mesh>
      <mesh position={[0, -(H / 2 - 0.04), 0]}>
        <boxGeometry args={[W + 0.06, 0.09, THICK + 0.06]} />
        <meshStandardMaterial {...GOLD_MAT_PROPS} />
      </mesh>
      <mesh position={[-(W / 2 - 0.04), 0, 0]}>
        <boxGeometry args={[0.09, H + 0.06, THICK + 0.06]} />
        <meshStandardMaterial {...GOLD_MAT_PROPS} />
      </mesh>
      <mesh position={[W / 2 - 0.04, 0, 0]}>
        <boxGeometry args={[0.09, H + 0.06, THICK + 0.06]} />
        <meshStandardMaterial {...GOLD_MAT_PROPS} />
      </mesh>

      {/* Corner emerald gems */}
      {([ [-1,-1],[1,-1],[-1,1],[1,1] ] as [number,number][]).map(([sx, sy], idx) => (
        <mesh key={idx} position={[sx * (W / 2 - 0.14), sy * (H / 2 - 0.18), THICK / 2 + 0.01]}>
          <octahedronGeometry args={[0.10, 0]} />
          <meshStandardMaterial
            color="#0f4030"
            emissive="#10b981"
            emissiveIntensity={2.8}
            metalness={0.85}
            roughness={0.08}
          />
        </mesh>
      ))}

      {/* Rune sigil on front cover */}
      <RuneDecal />

      {/* Primary golden light source */}
      <pointLight ref={glowRef} color="#ffd060" intensity={3.5} distance={14} />
      {/* Emerald accent */}
      <pointLight color="#10b981" intensity={0.9} distance={9} position={[0, 0.6, 2.2]} />

      {/* Soft outer glow sphere */}
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          ref={glowSphere}
          color="#d4a017"
          transparent
          opacity={0.028}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

    </group>
  )
}
