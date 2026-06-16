'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  {
    id: 'features',
    eyebrow: 'Eye Tracking',
    accent: '#0071e3',
    title: 'Look to select.\nAlways.',
    description:
      'NEXUS ONE uses high-performance eye tracking to detect exactly where you\'re looking. Respond to a glance, a tap, or your voice — instantly, naturally.',
    visual: <EyeVisual />,
  },
  {
    id: 'display',
    eyebrow: 'Spatial Display',
    accent: '#06b6d4',
    title: '23 million\npixels per eye.',
    description:
      'The micro-OLED display system packs 23 million pixels into each eye. Every detail is breathtaking in ways that make reality feel limited.',
    visual: <DisplayVisual />,
  },
  {
    id: 'neural',
    eyebrow: 'Neural Engine',
    accent: '#7c3aed',
    title: 'Thoughts become\nactions.',
    description:
      'The M3 Ultra Neural Processing Unit runs machine learning tasks at up to 38 TOPS, enabling spatial experiences that feel like magic.',
    visual: <NeuralVisual />,
  },
]

function EyeVisual() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center">
      {[180, 120, 70].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#0071e3]/30"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        />
      ))}
      {/* Iris */}
      <div
        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'radial-gradient(circle, #0071e3 0%, #003f8a 100%)', boxShadow: '0 0 40px rgba(0,113,227,0.6)' }}
      >
        <div className="w-6 h-6 rounded-full bg-black/70" />
        <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-white/40" />
      </div>
      {/* Scan lines */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-[1px] bg-[#0071e3]/20"
          style={{ top: `${30 + i * 12}%` }}
          animate={{ opacity: [0, 0.6, 0], scaleX: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  )
}

function DisplayVisual() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto flex items-center justify-center">
      <div
        className="w-56 h-36 rounded-2xl border border-[#06b6d4]/20 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(0,0,0,0.8) 100%)' }}
      >
        {/* Pixel grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
        {/* Content lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-6">
          {[80, 60, 70, 45].map((w, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-[#06b6d4]/40"
              style={{ width: `${w}%` }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
        {/* Corner glow */}
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-xl" style={{ background: 'rgba(6,182,212,0.3)' }} />
      </div>
      <motion.p
        className="absolute -bottom-2 text-[#06b6d4]/60 text-xs tracking-widest uppercase font-medium"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        23M pixels / eye
      </motion.p>
    </div>
  )
}

function NeuralVisual() {
  const nodes = [
    { x: 50, y: 20 },
    { x: 20, y: 45 }, { x: 50, y: 45 }, { x: 80, y: 45 },
    { x: 35, y: 70 }, { x: 65, y: 70 },
    { x: 50, y: 88 },
  ]
  const connections = [
    [0,1],[0,2],[0,3],[1,4],[2,4],[2,5],[3,5],[4,6],[5,6],
  ]

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.4))' }}>
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(124,58,237,0.4)"
            strokeWidth="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r="2.5"
            fill="#7c3aed"
            animate={{ r: [2.5, 3.5, 2.5], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function FeatureSection({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.35 })
  const isEven = index % 2 === 0

  return (
    <section ref={ref} id={feature.id} className="min-h-screen flex items-center py-28 px-6">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -32 : 32 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -32 : 32 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`${isEven ? 'lg:order-1' : 'lg:order-2'} order-2`}
        >
          <div
            className="relative rounded-3xl border border-white/[0.07] p-8 overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at center, ${feature.accent}0D 0%, rgba(0,0,0,0.6) 80%)`,
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl"
              style={{ background: `${feature.accent}22` }}
            />
            {feature.visual}
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`${isEven ? 'lg:order-2' : 'lg:order-1'} order-1`}
        >
          <p
            className="text-[13px] font-medium tracking-[0.28em] uppercase mb-5"
            style={{ color: feature.accent }}
          >
            {feature.eyebrow}
          </p>
          <h2
            className="text-[clamp(34px,4.5vw,60px)] font-bold text-white leading-[1.12] tracking-tight mb-7 whitespace-pre-line"
          >
            {feature.title}
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            {feature.description}
          </p>
          <motion.div
            className="mt-10 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default function VisionFeatures() {
  return (
    <div className="bg-black">
      {FEATURES.map((f, i) => (
        <FeatureSection key={f.id} feature={f} index={i} />
      ))}
    </div>
  )
}
