'use client'
import { motion } from 'framer-motion'
import GlassCard from './ui/GlassCard'

const FEATURES = [
  {
    symbol: '✦',
    title: 'Immersive 3D Worlds',
    description:
      'Step into breathtaking three-dimensional environments crafted with cinematic precision. Every pixel tells a story born from the finest digital artistry.',
    glow: 'purple' as const,
    accent: 'text-purple-400',
    bg: 'bg-purple-500/8',
    bar: 'from-purple-500/40',
  },
  {
    symbol: '◈',
    title: 'Fluid Motion Design',
    description:
      'Animations that breathe and flow naturally. Physics-based interactions that feel alive, responsive, and intuitively human across every touchpoint.',
    glow: 'pink' as const,
    accent: 'text-pink-400',
    bg: 'bg-pink-500/8',
    bar: 'from-pink-500/40',
  },
  {
    symbol: '⬡',
    title: 'Luxury Aesthetics',
    description:
      'Dark, sophisticated visual language inspired by the finest digital craftsmanship. An aesthetic where restraint and opulence coexist in perfect harmony.',
    glow: 'gold' as const,
    accent: 'text-amber-400',
    bg: 'bg-amber-500/8',
    bar: 'from-amber-400/40',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

export default function Features() {
  return (
    <section id="features" className="relative py-36 px-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-radial-purple pointer-events-none opacity-60" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/55" />
            <span className="text-[10px] tracking-[0.45em] uppercase text-purple-300/55">
              Capabilities
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/55" />
          </div>
          <h2 className="font-playfair text-4xl md:text-[3.5rem] font-bold leading-tight text-white mb-6">
            Crafted for{' '}
            <span className="gradient-text italic">Excellence</span>
          </h2>
          <p className="max-w-lg mx-auto text-white/40 text-[0.95rem] leading-relaxed">
            Every element is meticulously designed to create moments of pure wonder —
            blending the art of cinema with the precision of engineering.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => (
            <GlassCard key={i} glowColor={f.glow} delay={i * 0.12} className="p-7">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${f.bg} ${f.accent} text-xl font-bold`}>
                {f.symbol}
              </div>

              <h3 className="font-playfair text-xl font-semibold text-white mb-3 leading-snug">
                {f.title}
              </h3>
              <p className="text-white/38 text-sm leading-relaxed mb-6">
                {f.description}
              </p>

              {/* Accent bar */}
              <div className={`h-px w-full bg-gradient-to-r ${f.bar} to-transparent`} />
            </GlassCard>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { val: '∞',    label: 'Possibilities' },
            { val: '60',   label: 'FPS Rendering' },
            { val: '4K',   label: 'Resolution' },
            { val: '0.1s', label: 'Response Time' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-5 text-center border border-white/4">
              <div className="font-cinzel text-2xl md:text-3xl font-bold gradient-text mb-1">
                {stat.val}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
