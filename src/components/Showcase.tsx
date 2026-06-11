'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import dynamic from 'next/dynamic'

const ShowcaseCanvas = dynamic(() => import('./canvas/ShowcaseCanvas'), { ssr: false })

const TECH_STATS = [
  { val: '2.4M',  label: 'Polygons' },
  { val: '128',   label: 'Light Sources' },
  { val: '60fps', label: 'Real-time' },
  { val: '∞',     label: 'Animations' },
]

const FEATURES_LIST = [
  { icon: '◦', text: 'Physics-based distortion at 60fps' },
  { icon: '◦', text: 'Mouse-reactive surface tension' },
  { icon: '◦', text: 'Procedural particle halo system' },
  { icon: '◦', text: 'Dynamic light scattering & bloom' },
]

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="showcase" className="relative py-36 px-6 overflow-hidden">
      {/* Central glow blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(109,40,217,0.14) 0%, rgba(236,72,153,0.07) 50%, transparent 72%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-7xl mx-auto" ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* LEFT: 3D canvas panel */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.92 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative h-[480px] md:h-[540px] rounded-3xl overflow-hidden glass border border-white/6">
              <ShowcaseCanvas />

              {/* Corner accents */}
              {(['tl','tr','bl','br'] as const).map((pos) => (
                <div
                  key={pos}
                  className={`absolute w-7 h-7 ${
                    pos === 'tl' ? 'top-4 left-4 border-t border-l' :
                    pos === 'tr' ? 'top-4 right-4 border-t border-r' :
                    pos === 'bl' ? 'bottom-4 left-4 border-b border-l' :
                                   'bottom-4 right-4 border-b border-r'
                  } border-purple-400/35`}
                />
              ))}

              {/* Floating label */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <div className="glass rounded-full px-4 py-1.5 border border-white/8 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-white/45">
                    Interactive — Move cursor
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: copy + stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 44 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.18 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-400/55" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-pink-300/55">
                  Interactive
                </span>
              </div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight">
                Sculpted in{' '}
                <span className="gradient-text italic">Three Dimensions</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 44 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.32 }}
              className="text-white/40 leading-relaxed text-[0.95rem]"
            >
              Move your cursor over the orb and watch reality bend. Every interaction
              is a dialogue between physics and artistry — real-time rendering elevated
              to an art form.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0, x: 44 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.44 }}
              className="space-y-3"
            >
              {FEATURES_LIST.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/50">
                  <span className="text-purple-400 text-lg leading-none">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </motion.ul>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.56 }}
              className="grid grid-cols-2 gap-3 pt-2"
            >
              {TECH_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 border border-white/5 hover:border-purple-500/25 transition-colors duration-300"
                >
                  <div className="font-cinzel text-xl font-bold gradient-text mb-1">
                    {stat.val}
                  </div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-white/35">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
