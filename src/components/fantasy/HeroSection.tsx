'use client'
import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'

const FantasyCanvas = dynamic(
  () => import('@/components/canvas/fantasy/FantasyCanvas'),
  { ssr: false, loading: () => null }
)

/* ── Magnetic CTA button ─────────────────────────────────────────────────── */

function CTAButton({
  label,
  primary,
}: {
  label: string
  primary?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const bx  = useRef(0)
  const by  = useRef(0)

  useEffect(() => {
    const el  = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const dx   = e.clientX - (rect.left + rect.width  / 2)
      const dy   = e.clientY - (rect.top  + rect.height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 80) {
        bx.current = dx * 0.28
        by.current = dy * 0.28
      }
      gsap.to(el, { x: bx.current, y: by.current, duration: 0.35, ease: 'power3.out' })
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <button
      ref={ref}
      data-hover
      className={`relative px-8 py-4 rounded-full text-[11px] tracking-[0.35em] uppercase font-medium transition-all duration-300 overflow-hidden group ${
        primary
          ? 'text-[#050510]'
          : 'text-white/65 border border-white/15 hover:border-white/30 hover:text-white'
      }`}
      style={
        primary
          ? {
              background: 'linear-gradient(135deg, #d4a017, #f0c040, #b8860b)',
              boxShadow:  '0 0 32px rgba(212,160,23,0.35), 0 4px 24px rgba(212,160,23,0.22)',
            }
          : undefined
      }
    >
      {primary && (
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.18) 0%, transparent 60%)' }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}

/* ── Scroll indicator ─────────────────────────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none"
    >
      <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(212,160,23,0.40)' }}>
        Scroll
      </span>
      <div className="w-px h-10 overflow-hidden" style={{ background: 'rgba(212,160,23,0.15)' }}>
        <motion.div
          className="w-full"
          style={{ background: 'linear-gradient(to bottom, transparent, #d4a017, transparent)', height: '50%' }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

/* ── Hero Section ────────────────────────────────────────────────────────── */

const TITLE = 'ARCANE CODEX'

export default function HeroSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  })

  const textY    = useTransform(scrollYProgress, [0, 1], [0, -90])
  const textOpac = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const canvasS  = useTransform(scrollYProgress, [0, 0.8], [1, 1.12])

  /* ── GSAP entrance animation ─────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      const letters = titleRef.current?.querySelectorAll('.f-letter')

      if (eyebrowRef.current)  gsap.set(eyebrowRef.current,  { opacity: 0, y: 28 })
      if (letters)             gsap.set(letters,             { opacity: 0, y: 72, rotateX: -80, filter: 'blur(8px)' })
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 22 })
      if (ctaRef.current)      gsap.set(ctaRef.current,      { opacity: 0, y: 18 })

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.7 })

      if (letters && letters.length) {
        tl.to(letters, {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          stagger:  0.055,
          duration: 1.0,
          ease:     'power4.out',
        }, '-=0.3')
      }

      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.4')
        .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.35')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#030610' }}
    >
      {/* 3D canvas — full bleed background */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: canvasS }}
      >
        <FantasyCanvas />
      </motion.div>

      {/* Bottom gradient to blend into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #050510)' }}
      />

      {/* Side vignettes */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, #030610 100%)',
        }}
      />

      {/* Text overlay */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
        style={{ y: textY, opacity: textOpac }}
      >
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-[10px] tracking-[0.65em] uppercase mb-7 font-medium"
          style={{ color: 'rgba(212,160,23,0.70)' }}
        >
          ✦ &nbsp; The Ancient Grimoire &nbsp; ✦
        </p>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-cinzel text-6xl sm:text-7xl lg:text-[6.5rem] font-semibold mb-7 leading-none tracking-wider"
          style={{ perspective: '600px', transformStyle: 'preserve-3d' }}
        >
          {TITLE.split('').map((ch, i) => (
            <span
              key={i}
              className="f-letter inline-block"
              style={{
                display:   ch === ' ' ? 'inline' : 'inline-block',
                background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 40%, #c8950a 65%, #e8b820 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
                textShadow:           'none',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-7">
          <div className="h-px w-16 opacity-40"
               style={{ background: 'linear-gradient(to right, transparent, #d4a017)' }} />
          <span className="text-[10px] tracking-[0.5em] uppercase"
                style={{ color: 'rgba(212,160,23,0.45)' }}>
            Est. III Millennium
          </span>
          <div className="h-px w-16 opacity-40"
               style={{ background: 'linear-gradient(to left, transparent, #d4a017)' }} />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/55 text-base sm:text-lg leading-relaxed mb-10 max-w-xl font-light"
        >
          A living compendium of ancient wisdom. Every page breathes with forgotten
          power — choose your path and let the ritual begin.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <CTAButton label="Open the Codex" primary />
          <CTAButton label="Explore Rituals" />
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  )
}
