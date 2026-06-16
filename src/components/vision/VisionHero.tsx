'use client'

import { motion } from 'framer-motion'

const RING_CONFIGS = [
  { size: 640, duration: 32, reversed: false, dotColor: '#60a5fa', dotGlow: 'rgba(96,165,250,0.9)' },
  { size: 460, duration: 22, reversed: true,  dotColor: '#c084fc', dotGlow: 'rgba(192,132,252,0.9)' },
  { size: 300, duration: 16, reversed: false, dotColor: '#22d3ee', dotGlow: 'rgba(34,211,238,0.9)' },
]

const PARTICLES = [
  { x: 18, y: 24, size: 2, delay: 0 },
  { x: 78, y: 15, size: 1.5, delay: 0.8 },
  { x: 62, y: 72, size: 2.5, delay: 1.4 },
  { x: 34, y: 68, size: 1, delay: 0.3 },
  { x: 85, y: 46, size: 2, delay: 2.1 },
  { x: 10, y: 55, size: 1.5, delay: 1.7 },
  { x: 92, y: 80, size: 1, delay: 0.6 },
  { x: 48, y: 10, size: 2, delay: 2.4 },
  { x: 70, y: 90, size: 1.5, delay: 1.1 },
  { x: 25, y: 88, size: 1, delay: 3.0 },
]

export default function VisionHero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden" id="hero">

      {/* ── Atmosphere glows ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,113,227,0.13) 0%, rgba(0,113,227,0.04) 40%, transparent 70%)' }}
        />
        <div
          className="absolute top-[38%] right-[28%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 60%)' }}
        />
      </div>

      {/* ── Floating star particles ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0,
            }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Orbital rings ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[48%] pointer-events-none select-none">
        {RING_CONFIGS.map((ring, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.05]"
            style={{
              width: ring.size,
              height: ring.size,
              marginLeft: -ring.size / 2,
              marginTop: -ring.size / 2,
              animation: `spin ${ring.duration}s linear infinite ${ring.reversed ? 'reverse' : ''}`,
            }}
          >
            {/* Orbiting dot */}
            <div
              className="absolute -top-[3px] left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: i === 0 ? 5 : i === 1 ? 4 : 3,
                height: i === 0 ? 5 : i === 1 ? 4 : 3,
                background: ring.dotColor,
                boxShadow: `0 0 8px ${ring.dotGlow}, 0 0 16px ${ring.dotGlow}`,
              }}
            />
          </div>
        ))}

        {/* Central visor shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
          {/* Left lens */}
          <div
            className="w-[110px] h-[72px] rounded-[50%] border border-white/[0.12]"
            style={{
              background: 'radial-gradient(ellipse at 40% 35%, rgba(0,113,227,0.25) 0%, rgba(0,113,227,0.06) 50%, transparent 80%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px rgba(0,113,227,0.12)',
            }}
          />
          {/* Bridge */}
          <div className="w-5 h-[2px] bg-white/10 rounded-full" />
          {/* Right lens */}
          <div
            className="w-[110px] h-[72px] rounded-[50%] border border-white/[0.12]"
            style={{
              background: 'radial-gradient(ellipse at 60% 35%, rgba(0,113,227,0.25) 0%, rgba(0,113,227,0.06) 50%, transparent 80%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), 0 0 30px rgba(0,113,227,0.12)',
            }}
          />
        </div>

        {/* Inner glow pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,113,227,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Hero copy ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl">

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#0071e3] text-[13px] font-medium tracking-[0.3em] uppercase mb-7"
        >
          Introducing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-[clamp(52px,10vw,120px)] font-bold text-white leading-none tracking-[-0.02em] mb-7"
        >
          NEXUS ONE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(18px,2.4vw,30px)] text-white/65 font-light tracking-tight mb-3"
        >
          Spatial Computing, Redefined.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-white/35 text-base mb-12 font-light"
        >
          From <span className="text-white/60">$3,499</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#order"
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(0,113,227,0.55)] hover:scale-105 active:scale-95"
          >
            Order Now
          </a>
          <a
            href="#features"
            className="text-[#0071e3] text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1.5 group"
          >
            Learn more
            <svg
              className="group-hover:translate-x-0.5 transition-transform"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ── Mouse scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[22px] h-[36px] rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <motion.div
            className="w-[3px] h-[6px] rounded-full bg-white/50"
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/25 text-[10px] tracking-[0.22em] uppercase">Scroll</span>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
