'use client'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  scrollY: number
}

export default function CameraRig({ scrollY }: CameraRigProps) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((_, delta) => {
    const targetX = mouse.current.x * 0.7
    const targetY = mouse.current.y * 0.4
    const targetZ = 8 - (scrollY / (typeof window !== 'undefined' ? window.innerHeight : 800)) * 1.8

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 1.8)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 1.8)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 1.2)
    camera.lookAt(0, 0, 0)
  })

  return null
}
