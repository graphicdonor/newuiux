'use client'
import { useRef, useEffect } from 'react'

export default function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const pos      = useRef({ x: -100, y: -100 })
  const target   = useRef({ x: -100, y: -100 })
  const hovered  = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => { hovered.current = true }
    const onLeave = () => { hovered.current = false }

    window.addEventListener('mousemove', onMove, { passive: true })

    const interactives = document.querySelectorAll('a, button, [data-hover]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    let raf: number
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.10
      pos.current.y += (target.current.y - pos.current.y) * 0.10

      if (outerRef.current) {
        const scale = hovered.current ? 1.9 : 1
        outerRef.current.style.transform = `translate(${pos.current.x - 24}px, ${pos.current.y - 24}px) scale(${scale})`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${target.current.x - 4}px, ${target.current.y - 4}px)`
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Outer soft glow */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998] rounded-full transition-transform duration-200"
        style={{
          background: 'radial-gradient(circle, rgba(212,160,23,0.28) 0%, rgba(212,160,23,0.10) 40%, transparent 70%)',
          boxShadow: '0 0 28px 8px rgba(212,160,23,0.18)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Inner sharp dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999] rounded-full"
        style={{
          background: 'rgba(240,192,64,0.95)',
          boxShadow:  '0 0 6px 2px rgba(240,192,64,0.7)',
        }}
      />
    </>
  )
}
