'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CARDS = [
  {
    accent: '#0071e3',
    label: 'EyeSight',
    title: 'Connect with the world',
    description:
      'When you\'re using NEXUS ONE, EyeSight reveals your eyes to others nearby — so you always stay present.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    accent: '#06b6d4',
    label: 'Spatial Audio',
    title: 'Sound all around you',
    description:
      'Personalized Spatial Audio makes every sound feel like it\'s coming from exactly where it should — inside your world.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    ),
  },
  {
    accent: '#f59e0b',
    label: 'M3 Ultra',
    title: "World's fastest chip",
    description:
      'The M3 Ultra Neural Processing Unit delivers unprecedented performance — enabling experiences that would otherwise be impossible.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="9" y="9" width="6" height="6"/>
        <path d="M9 2v3M15 2v3M9 22v-3M15 22v-3M2 9h3M2 15h3M22 9h-3M22 15h-3"/>
      </svg>
    ),
  },
  {
    accent: '#7c3aed',
    label: 'visionOS 2',
    title: 'A new spatial OS',
    description:
      'visionOS 2 is designed from the ground up for spatial computing, with a completely new interaction model.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    accent: '#10b981',
    label: 'All-Day Power',
    title: '12+ hours battery',
    description:
      'The external battery pack delivers up to 12 hours of continuous use — keeping you in the flow all day.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="7" width="18" height="10" rx="2"/>
        <path d="M22 11v2"/>
        <path d="M6 11h6"/>
      </svg>
    ),
  },
  {
    accent: '#ec4899',
    label: 'Privacy',
    title: 'Built-in from the start',
    description:
      'Advanced sensor protection and on-device neural processing ensures your biometric data never leaves your device.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

export default function VisionGrid() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  return (
    <section className="bg-black py-36 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <p className="text-[#0071e3] text-[13px] font-medium tracking-[0.28em] uppercase mb-5">
            Capabilities
          </p>
          <h2 className="text-[clamp(34px,5vw,60px)] font-bold text-white leading-tight tracking-tight">
            Every detail.{' '}
            <span className="text-white/35">Considered.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <CardItem key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CardItem({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-7 rounded-3xl border border-white/[0.07] overflow-hidden cursor-default"
      style={{ background: 'rgba(255,255,255,0.025)' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 40%, ${card.accent}12 0%, transparent 65%)` }}
      />

      {/* Top shine on hover */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}60, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${card.accent}1A`, color: card.accent }}
      >
        <div className="w-5 h-5">{card.icon}</div>
      </div>

      <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: card.accent }}>
        {card.label}
      </p>
      <h3 className="text-[17px] font-semibold text-white mb-3 leading-snug">{card.title}</h3>
      <p className="text-white/45 text-[14px] leading-relaxed">{card.description}</p>
    </motion.div>
  )
}
