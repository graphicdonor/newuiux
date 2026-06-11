'use client'
import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'

const TeaScene = dynamic(
  () => import('@/components/canvas/teasanti/TeaScene'),
  { ssr: false, loading: () => null }
)

/* ── Scroll indicator ─────────────────────────────────────────────────────── */

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 4.0, duration: 1.2 }}
      className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none"
    >
      <span className="text-[9px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,180,131,0.40)' }}>
        Scroll
      </span>
      <div className="w-px h-10 overflow-hidden" style={{ background: 'rgba(212,180,131,0.14)' }}>
        <motion.div
          className="w-full"
          style={{ background: 'linear-gradient(to bottom, transparent, #D4B483, transparent)', height: '45%' }}
          animate={{ y: ['-100%', '220%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyeRef     = useRef<HTMLParagraphElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  })
  const textY   = useTransform(scrollYProgress, [0, 1], [0, -80])
  const textOp  = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const canvasS = useTransform(scrollYProgress, [0, 0.8], [1, 1.08])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      const letters = titleRef.current?.querySelectorAll('.ts-letter')

      gsap.set([eyeRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 30 })
      if (letters?.length) gsap.set(letters, { opacity: 0, y: 65, rotateX: -75, filter: 'blur(6px)' })

      tl.to(eyeRef.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.9 })

      if (letters?.length) {
        tl.to(letters, {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          stagger: 0.048,
          duration: 1.1,
          ease: 'power4.out',
        }, '-=0.35')
      }

      tl.to(subRef.current,  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.45')
        .to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.35')
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0D1F1A' }}
    >
      {/* 3D scene */}
      <motion.div className="absolute inset-0" style={{ scale: canvasS }}>
        <TeaScene />
      </motion.div>

      {/* Vignettes */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 42%, #0D1F1A 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #0D1F1A)' }}
      />

      {/* Text content */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-3xl mx-auto flex flex-col items-center"
        style={{ y: textY, opacity: textOp }}
      >
        {/* Eyebrow */}
        <p
          ref={eyeRef}
          className="text-[10px] tracking-[0.65em] uppercase mb-6 font-medium"
          style={{ color: 'rgba(212,180,131,0.65)' }}
        >
          ✦ &nbsp; A Ritual Since Ancient Times &nbsp; ✦
        </p>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-cinzel font-semibold mb-7 leading-[1.08] tracking-wider"
          style={{ fontSize: 'clamp(3.2rem, 8vw, 7rem)', perspective: '600px', transformStyle: 'preserve-3d' }}
        >
          {'Every Cup'.split('').map((ch, i) => (
            <span
              key={`a-${i}`}
              className="ts-letter inline-block"
              style={{
                display: ch === ' ' ? 'inline' : 'inline-block',
                color: '#F8F4ED',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
          <br />
          {'Is A Ritual'.split('').map((ch, i) => (
            <span
              key={`b-${i}`}
              className="ts-letter inline-block"
              style={{
                display: ch === ' ' ? 'inline' : 'inline-block',
                background: 'linear-gradient(135deg, #D4B483 0%, #f0d090 45%, #c8a060 80%, #D4B483 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip: 'text',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-7">
          <div className="h-px w-14 opacity-35" style={{ background: 'linear-gradient(to right, transparent, #D4B483)' }} />
          <span className="text-[9px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,180,131,0.45)' }}>
            Single Origin · Shade Grown
          </span>
          <div className="h-px w-14 opacity-35" style={{ background: 'linear-gradient(to left, transparent, #D4B483)' }} />
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg font-light"
          style={{ color: 'rgba(248,244,237,0.55)' }}
        >
          Each leaf hand-picked at sunrise. Each cup steeped with intention.
          TeaSanti transforms your daily brew into a meditative act.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="#collection"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase font-medium"
            style={{
              background: 'linear-gradient(135deg, #D4B483, #f0d090, #b8904a)',
              color: '#0D1F1A',
              boxShadow: '0 0 32px rgba(212,180,131,0.35), 0 4px 20px rgba(212,180,131,0.20)',
            }}
          >
            Shop Collection
          </motion.a>
          <motion.a
            href="#ritual"
            whileHover={{ scale: 1.04, borderColor: 'rgba(212,180,131,0.55)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full text-[11px] tracking-[0.32em] uppercase transition-all duration-300"
            style={{
              border: '1px solid rgba(212,180,131,0.25)',
              color:  'rgba(248,244,237,0.65)',
            }}
          >
            Discover Rituals
          </motion.a>
        </div>
      </motion.div>

      <ScrollCue />
    </section>
  )
}
