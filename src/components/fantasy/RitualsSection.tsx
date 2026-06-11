'use client'
import { motion } from 'framer-motion'
import RitualCard, { type RitualData } from './RitualCard'

const RITUALS: RitualData[] = [
  {
    id:          'dawn',
    name:        'Dawn Ritual',
    subtitle:    'The Golden Awakening',
    description:
      'Harness the first light as it breaches the horizon. A ritual of clarity, renewal, and radiant intention — golden energy flows through every incantation as the world stirs from slumber.',
    time:        '04:32 — First Light',
    icon:        '☀',
    glowColor:   '#f59e0b',
    borderFrom:  '#f59e0b',
    borderTo:    '#ef4444',
    gradient:    'linear-gradient(145deg, #120800 0%, #1a0c00 40%, #0d0600 100%)',
    particles:   '#f59e0b',
    tags:        ['Renewal', 'Clarity', 'Solar Energy'],
  },
  {
    id:          'dusk',
    name:        'Dusk Ritual',
    subtitle:    'The Twilight Convergence',
    description:
      'Stand at the threshold between worlds. As day surrenders to night, both realms weaken their veil — a moment of convergence where arcane symbols glow with unmatched power.',
    time:        '19:17 — Twilight Veil',
    icon:        '🌙',
    glowColor:   '#a855f7',
    borderFrom:  '#a855f7',
    borderTo:    '#f97316',
    gradient:    'linear-gradient(145deg, #0e0818 0%, #150c22 40%, #0a0510 100%)',
    particles:   '#c084fc',
    tags:        ['Transformation', 'Mysticism', 'Liminal'],
  },
  {
    id:          'night',
    name:        'Night Ritual',
    subtitle:    'The Celestial Binding',
    description:
      'Beneath a canopy of stars the ancient pacts are sealed. Celestial alignments amplify every word of power — the cosmos itself becomes your witness in this most sacred working.',
    time:        '00:00 — Midnight Zenith',
    icon:        '✦',
    glowColor:   '#22d3ee',
    borderFrom:  '#1d4ed8',
    borderTo:    '#22d3ee',
    gradient:    'linear-gradient(145deg, #04060f 0%, #06091a 40%, #020408 100%)',
    particles:   '#38bdf8',
    tags:        ['Celestial', 'Binding', 'Star Pacts'],
  },
]

export default function RitualsSection() {
  return (
    <section className="relative min-h-screen py-28 px-6 overflow-hidden">

      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-[#050510]">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(100,50,180,0.12) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(16,185,129,0.07) 0%, transparent 55%)',
        }} />
      </div>

      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), rgba(16,185,129,0.25), transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-[10px] tracking-[0.55em] uppercase mb-5"
            style={{ color: 'rgba(212,160,23,0.65)' }}
          >
            Ancient Mysteries
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 35%, #34d399 70%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Choose Your Ritual
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-6 h-px w-48 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #d4a017, #34d399, transparent)' }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/45 text-sm tracking-wide max-w-xl mx-auto leading-relaxed"
          >
            Each path through the arcane holds its own power. Select the moment
            that resonates with your intention and let the old magic flow.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {RITUALS.map((ritual, idx) => (
            <motion.div
              key={ritual.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.95,
                delay:    idx * 0.14,
                ease:     [0.22, 1, 0.36, 1],
              }}
            >
              <RitualCard ritual={ritual} />
            </motion.div>
          ))}
        </div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-[9px] tracking-[0.6em] uppercase"
             style={{ color: 'rgba(212,160,23,0.30)' }}>
            ✦ &nbsp; The Book Awaits &nbsp; ✦
          </p>
        </motion.div>

      </div>

      {/* Decorative bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.25), rgba(212,160,23,0.35), transparent)' }}
      />
    </section>
  )
}
