'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FOOTNOTES = ['Crafted with Purpose', '∙', 'Built for Excellence', '∙', 'Made to Last']

export default function CTA() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} className="relative py-44 px-6 overflow-hidden">
      {/* Dual glow blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 480,
          background:
            'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, rgba(236,72,153,0.08) 45%, transparent 70%)',
          filter: 'blur(55px)',
          borderRadius: '50%',
        }}
      />

      {/* Animated horizontal rule lines */}
      {[0.2, 0.5, 0.78].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, delay: i * 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            top: `${pos * 100}%`,
            background: `linear-gradient(90deg, transparent 0%, rgba(168,85,247,${0.06 - i * 0.015}) 50%, transparent 100%)`,
            transformOrigin: 'center',
          }}
        />
      ))}

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Section label */}
          <div className="flex items-center justify-center gap-4 mb-9">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/55" />
            <span className="text-[10px] tracking-[0.45em] uppercase text-purple-300/55">Begin</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/55" />
          </div>

          {/* Headline */}
          <h2 className="font-cinzel leading-tight mb-8" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}>
            <span className="text-white">Step Into</span>
            <br />
            <span className="gradient-text">The Light</span>
          </h2>

          {/* Body */}
          <p className="text-white/40 text-base md:text-lg leading-relaxed mb-13 max-w-xl mx-auto">
            Your journey into extraordinary digital experiences begins with a single
            moment of courage. Are you ready to transcend the ordinary?
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-10 py-5 rounded-full text-[11px] tracking-[0.3em] uppercase overflow-hidden min-w-[210px]"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600" />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow:
                    '0 0 45px rgba(168,85,247,0.55), 0 0 90px rgba(168,85,247,0.2)',
                }}
              />
              <span className="relative font-semibold text-white">Begin Journey</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-5 rounded-full text-[11px] tracking-[0.3em] uppercase border border-white/10 text-white/45 hover:text-white/75 hover:border-white/22 transition-all duration-300 min-w-[210px]"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {FOOTNOTES.map((item, i) => (
            <span key={i} className="text-[9px] tracking-[0.35em] uppercase text-white/18">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
