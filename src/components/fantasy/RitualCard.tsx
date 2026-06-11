'use client'
import { useRef, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface RitualData {
  id:          string
  name:        string
  subtitle:    string
  description: string
  time:        string
  icon:        string
  glowColor:   string
  borderFrom:  string
  borderTo:    string
  gradient:    string
  particles:   string
  tags:        string[]
}

/* ── Ambient particles (CSS-driven) ─────────────────────────────────────── */

function CardParticles({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left:     `${4 + i * 5.4}%`,
        duration: 3.2 + (i % 5) * 0.9,
        delay:    (i % 7) * 0.45,
        size:     i % 3 === 0 ? 3 : 2,
      })),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full fantasy-particle"
          style={{
            left:            p.left,
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            background:      color,
            boxShadow:       `0 0 5px 2px ${color}`,
            animationDuration:`${p.duration}s`,
            animationDelay:  `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Rotating border beam ────────────────────────────────────────────────── */

function BorderBeam({ from, to }: { from: string; to: string }) {
  const rotation = useMotionValue(0)

  useEffect(() => {
    const ctrl = animate(rotation, 360, {
      duration:  5,
      repeat:    Infinity,
      ease:      'linear',
    })
    return ctrl.stop
  }, [rotation])

  const background = useTransform(
    rotation,
    (r) =>
      `conic-gradient(from ${r}deg, transparent 0%, ${from} 12%, ${to} 22%, transparent 35%)`
  )

  return (
    <motion.div
      className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
      style={{ background, opacity: 0.8 }}
    />
  )
}

/* ── Magnetic button ─────────────────────────────────────────────────────── */

function MagneticButton({
  children,
  glowColor,
}: {
  children: React.ReactNode
  glowColor: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const bx = useMotionValue(0)
  const by = useMotionValue(0)
  const sx = useSpring(bx, { stiffness: 380, damping: 28 })
  const sy = useSpring(by, { stiffness: 380, damping: 28 })

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = btnRef.current!.getBoundingClientRect()
      bx.set((e.clientX - (rect.left + rect.width  / 2)) * 0.30)
      by.set((e.clientY - (rect.top  + rect.height / 2)) * 0.30)
    },
    [bx, by]
  )

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={onMove}
      onMouseLeave={() => { bx.set(0); by.set(0) }}
      whileTap={{ scale: 0.94 }}
      className="relative px-7 py-3 rounded-full text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 overflow-hidden group"
      style={{
        x:          sx,
        y:          sy,
        background: `linear-gradient(135deg, ${glowColor}22, ${glowColor}11)`,
        border:     `1px solid ${glowColor}55`,
        color:      glowColor,
        boxShadow:  `0 0 20px ${glowColor}22`,
      }}
    >
      <span className="relative z-10">Begin Ritual</span>
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${glowColor}28 0%, transparent 70%)` }}
      />
    </motion.button>
  )
}

/* ── Ritual Card ─────────────────────────────────────────────────────────── */

export default function RitualCard({ ritual }: { ritual: RitualData }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale   = useMotionValue(1)

  const springX = useSpring(rotateX, { stiffness: 280, damping: 24 })
  const springY = useSpring(rotateY, { stiffness: 280, damping: 24 })
  const springS = useSpring(scale,   { stiffness: 240, damping: 22 })

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current!.getBoundingClientRect()
      const nx   = (e.clientX - rect.left)  / rect.width  - 0.5
      const ny   = (e.clientY - rect.top)   / rect.height - 0.5
      rotateX.set(-ny * 22)
      rotateY.set( nx * 22)
    },
    [rotateX, rotateY]
  )

  const onEnter = useCallback(() => scale.set(1.04), [scale])
  const onLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }, [rotateX, rotateY, scale])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX:          springX,
        rotateY:          springY,
        scale:            springS,
        transformPerspective: 1100,
        transformStyle:   'preserve-3d',
      }}
      className="relative cursor-pointer select-none"
      data-hover
    >
      {/* Gradient border container */}
      <div
        className="relative rounded-[1.25rem] p-[1px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${ritual.borderFrom}55, ${ritual.borderTo}33, ${ritual.borderFrom}22)` }}
      >
        {/* Rotating border beam */}
        <BorderBeam from={ritual.borderFrom} to={ritual.borderTo} />

        {/* Card inner */}
        <div
          className="relative rounded-[1.2rem] overflow-hidden"
          style={{ background: ritual.gradient }}
        >
          {/* Ambient particles */}
          <CardParticles color={ritual.particles} />

          {/* Background texture glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 50% 80%, ${ritual.glowColor}18 0%, transparent 65%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col min-h-[520px]">

            {/* Icon */}
            <motion.div
              className="w-16 h-16 mb-6 rounded-xl flex items-center justify-center text-3xl"
              style={{
                background: `linear-gradient(135deg, ${ritual.glowColor}28, ${ritual.glowColor}12)`,
                border:     `1px solid ${ritual.glowColor}44`,
                boxShadow:  `0 0 24px ${ritual.glowColor}28`,
                translateZ: 20,
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {ritual.icon}
            </motion.div>

            {/* Time badge */}
            <span
              className="inline-block mb-4 text-[10px] tracking-[0.4em] uppercase px-3 py-1 rounded-full w-fit"
              style={{
                background: `${ritual.glowColor}18`,
                border:     `1px solid ${ritual.glowColor}38`,
                color:      ritual.glowColor,
              }}
            >
              {ritual.time}
            </span>

            {/* Title */}
            <h3
              className="font-cinzel text-2xl font-semibold mb-2 tracking-wide"
              style={{ color: ritual.glowColor }}
            >
              {ritual.name}
            </h3>
            <p className="text-white/45 text-xs tracking-[0.25em] uppercase mb-4">
              {ritual.subtitle}
            </p>

            {/* Description */}
            <p className="text-white/65 text-sm leading-relaxed flex-1 mb-6">
              {ritual.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ritual.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-md"
                  style={{
                    background: `${ritual.glowColor}12`,
                    color:      `${ritual.glowColor}cc`,
                    border:     `1px solid ${ritual.glowColor}25`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div>
              <MagneticButton glowColor={ritual.glowColor}>
                Begin Ritual
              </MagneticButton>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}
