'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function VisionCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <section id="order" className="relative bg-black pt-28 pb-40 px-6 overflow-hidden border-t border-white/[0.05]">

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,113,227,0.1) 0%, rgba(0,113,227,0.03) 40%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 60%)' }}
        />
      </div>

      {/* Animated rings behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        {[480, 360, 260].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/[0.04]"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div ref={ref} className="relative z-10 max-w-2xl mx-auto text-center">

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#0071e3] text-[13px] font-medium tracking-[0.28em] uppercase mb-7"
        >
          Available Now
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-[clamp(48px,8.5vw,100px)] font-bold text-white leading-none tracking-[-0.02em] mb-7"
        >
          NEXUS ONE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/45 text-xl mb-14 font-light"
        >
          From{' '}
          <span className="text-white font-medium">$3,499</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#"
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold px-10 py-4 rounded-full text-base transition-all duration-200 hover:shadow-[0_0_40px_rgba(0,113,227,0.6)] hover:scale-105 active:scale-95"
          >
            Order NEXUS ONE
          </a>
          <a
            href="#"
            className="text-[#0071e3] text-base font-medium hover:text-blue-300 transition-colors"
          >
            Shop online ›
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 text-white/22 text-[12px] max-w-sm mx-auto leading-relaxed"
        >
          Free delivery. Free returns. Limited quantities available.
          Reserve yours today.
        </motion.p>
      </div>

      {/* Footer strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 mt-32 pt-8 border-t border-white/[0.05] max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4"
      >
        <span className="text-white/22 text-[12px] tracking-[0.2em] uppercase font-medium">NEXUS</span>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Support', 'Contact'].map(link => (
            <a key={link} href="#" className="text-white/22 text-[12px] hover:text-white/50 transition-colors">
              {link}
            </a>
          ))}
        </div>
        <span className="text-white/18 text-[11px]">© 2026 NEXUS Inc. All rights reserved.</span>
      </motion.div>
    </section>
  )
}
