'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote:
      'An experience beyond description. The way light and motion interact creates something I can only call digital poetry — pure, transcendent, unforgettable.',
    author: 'Aria Chen',
    role:   'Creative Director, Nexus Studio',
    avatar: 'AC',
    stars:  5,
  },
  {
    quote:
      "I've worked with many digital studios, but nothing compares to this level of mastery. Every frame is a masterpiece. Every interaction a revelation.",
    author: 'Marcus Veil',
    role:   'CEO, Luminos Interactive',
    avatar: 'MV',
    stars:  5,
  },
  {
    quote:
      'The intersection of luxury and technology — executed flawlessly. This is what the future of digital presence looks like. Breathtaking from first load.',
    author: 'Sofia Laurent',
    role:   'Brand Strategist, Atelier Digital',
    avatar: 'SL',
    stars:  5,
  },
]

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48, scale: 0.97 }),
}

export default function Testimonials() {
  const [[index, dir], setPage] = useState([0, 0])

  const paginate = useCallback(
    (d: number) =>
      setPage(([prev]) => [(prev + d + TESTIMONIALS.length) % TESTIMONIALS.length, d]),
    []
  )

  // Auto-advance every 6 s
  useEffect(() => {
    const t = setInterval(() => paginate(1), 6000)
    return () => clearInterval(t)
  }, [paginate])

  const t = TESTIMONIALS[index]

  return (
    <section id="testimonials" className="relative py-36 px-6">
      <div className="absolute inset-0 bg-radial-pink opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500/55" />
            <span className="text-[10px] tracking-[0.45em] uppercase text-pink-300/55">Voices</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500/55" />
          </div>
          <h2 className="font-playfair text-4xl md:text-[3.2rem] font-bold text-white">
            What They{' '}
            <span className="gradient-text italic">Experience</span>
          </h2>
        </motion.div>

        {/* Card */}
        <div className="relative" style={{ minHeight: 300 }}>
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass rounded-3xl p-8 md:p-12 border border-white/6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-7">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-base leading-none">★</span>
                ))}
              </div>

              {/* Quote mark */}
              <div className="font-playfair text-6xl text-purple-500/25 leading-none mb-2 select-none">
                &ldquo;
              </div>

              {/* Quote text */}
              <blockquote className="font-playfair text-lg md:text-xl text-white/75 leading-relaxed mb-8 italic">
                {t.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.author}</p>
                  <p className="text-white/40 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-9">
          <button
            onClick={() => paginate(-1)}
            className="w-9 h-9 rounded-full border border-white/10 text-white/35 hover:text-white/80 hover:border-white/28 transition-all flex items-center justify-center text-sm"
            aria-label="Previous"
          >
            ←
          </button>

          <div className="flex gap-2 items-center">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage([i, i > index ? 1 : -1])}
                className={`rounded-full transition-all duration-400 ${
                  i === index
                    ? 'w-7 h-1.5 bg-purple-400'
                    : 'w-1.5 h-1.5 bg-white/18 hover:bg-white/35'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            className="w-9 h-9 rounded-full border border-white/10 text-white/35 hover:text-white/80 hover:border-white/28 transition-all flex items-center justify-center text-sm"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
