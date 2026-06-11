'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'

const Scene3D = dynamic(() => import('./canvas/Scene3D'), { ssr: false })

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const contentY   = useTransform(scrollYProgress, [0, 0.5], [0, -80])
  const contentOp  = useTransform(scrollYProgress, [0, 0.38], [1, 0])
  const canvasScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08])

  // Track raw scrollY for camera rig
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP letter-by-letter entrance
  useEffect(() => {
    if (!titleRef.current) return
    const letters = titleRef.current.querySelectorAll<HTMLSpanElement>('.hero-letter')
    gsap.fromTo(
      letters,
      { opacity: 0, y: 90, rotateX: -80 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.065,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.4,
      }
    )
  }, [])

  const TITLE = 'LUMINARY'

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen overflow-hidden grain"
    >
      {/* 3D canvas layer */}
      <motion.div
        style={{ scale: canvasScale }}
        className="absolute inset-0 origin-center"
      >
        <Scene3D scrollY={scrollY} />
      </motion.div>

      {/* Deep vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(2,0,8,0.55) 70%, rgba(2,0,8,0.92) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020008] to-transparent pointer-events-none" />

      {/* Hero text */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 select-none"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-purple-400/50" />
          <span className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-purple-300/70">
            The Future of Design
          </span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-purple-400/50" />
        </motion.div>

        {/* Main display title */}
        <div
          ref={titleRef}
          className="font-cinzel leading-none tracking-[0.14em] overflow-hidden"
          style={{ fontSize: 'clamp(3.5rem, 13vw, 10.5rem)', perspective: '1200px' }}
        >
          {TITLE.split('').map((ch, i) => (
            <span
              key={i}
              className="hero-letter inline-block gradient-text"
              style={{ opacity: 0, display: 'inline-block' }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="mt-5 text-[10px] md:text-xs tracking-[0.38em] uppercase text-white/35"
        >
          Cinematic &nbsp;·&nbsp; Immersive &nbsp;·&nbsp; Extraordinary
        </motion.p>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.65 }}
          className="mt-7 max-w-md text-white/45 text-sm md:text-[0.95rem] leading-relaxed"
        >
          Where artistry meets technology — an experience crafted at the intersection
          of wonder and precision.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.95 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group relative px-8 py-4 rounded-full text-[11px] tracking-[0.3em] uppercase overflow-hidden"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600" />
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ boxShadow: '0 0 40px rgba(168,85,247,0.55), 0 0 80px rgba(168,85,247,0.2)' }}
            />
            <span className="relative font-semibold text-white">Explore Now</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 rounded-full text-[11px] tracking-[0.3em] uppercase border border-white/12 text-white/50 hover:text-white/80 hover:border-white/25 transition-all duration-300"
          >
            Watch Story
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5"
      >
        <span className="text-[9px] tracking-[0.5em] uppercase text-white/25">Scroll</span>
        <motion.div
          animate={{ y: [0, 11, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-purple-400/55 to-transparent"
        />
      </motion.div>
    </section>
  )
}
