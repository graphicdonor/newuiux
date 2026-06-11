'use client'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CinematicCamera() {
  const { camera } = useThree()
  const mouse  = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    camera.position.set(0, 3, 14)

    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime

    // ── Smooth mouse lag ────────────────────────────────────────────────
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, target.current.x, delta * 2.2)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, target.current.y, delta * 2.2)

    // ── Cinematic orbital path ───────────────────────────────────────────
    const ORBIT_R    = 14
    const ORBIT_SPEED = 0.038

    const baseX = Math.sin(t * ORBIT_SPEED)          * ORBIT_R
    const baseZ = Math.cos(t * ORBIT_SPEED)          * ORBIT_R
               + Math.sin(t * ORBIT_SPEED * 0.5) * 4
    const baseY = 2.8 + Math.sin(t * 0.065) * 2.8

    // ── Add mouse parallax offset ────────────────────────────────────────
    const finalX = baseX + mouse.current.x * 2.8
    const finalY = baseY - mouse.current.y * 1.8   // invert Y for natural feel
    const finalZ = baseZ

    // ── Lerp camera toward target ────────────────────────────────────────
    const LERP = delta * 0.9
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, finalX, LERP)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, finalY, LERP)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, finalZ, LERP)

    // ── Gently drifting look-at target ───────────────────────────────────
    camera.lookAt(
      Math.sin(t * 0.018) * 2.5,
      Math.sin(t * 0.024) * 0.8,
      Math.cos(t * 0.018) * 2.0
    )
  })

  return null
}
