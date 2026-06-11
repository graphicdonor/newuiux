'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'Ritual',     href: '#ritual' },
  { label: 'Story',      href: '#story' },
  { label: 'Brew Guide', href: '#brew' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 backdrop-blur-xl border-b' : 'py-6'
      }`}
      style={scrolled ? {
        background: 'rgba(13,31,26,0.82)',
        borderColor: 'rgba(212,180,131,0.12)',
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <motion.a
          href="/teasanti"
          className="font-cinzel text-[1.05rem] tracking-[0.22em] select-none"
          style={{ color: '#D4B483' }}
          whileHover={{ opacity: 0.75 }}
        >
          TeaSanti
        </motion.a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[10.5px] tracking-[0.38em] uppercase transition-all duration-300 hover:opacity-100"
              style={{ color: 'rgba(248,244,237,0.48)' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(212,180,131,0.90)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(248,244,237,0.48)')}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          href="#collection"
          className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-[10.5px] tracking-[0.28em] uppercase transition-all duration-400"
          style={{
            background:  'rgba(212,180,131,0.10)',
            border:      '1px solid rgba(212,180,131,0.35)',
            color:       '#D4B483',
            boxShadow:   '0 0 18px rgba(212,180,131,0.08)',
          }}
          whileHover={{
            background: 'rgba(212,180,131,0.18)',
            boxShadow:  '0 0 28px rgba(212,180,131,0.18)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Shop Now
        </motion.a>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-300 origin-center"
              style={{
                background: 'rgba(212,180,131,0.70)',
                transform: open
                  ? i === 0 ? 'rotate(45deg) translateY(6px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translateY(-6px)'
                  : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              background:   'rgba(13,31,26,0.95)',
              borderColor:  'rgba(212,180,131,0.10)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <nav className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-[11px] tracking-[0.38em] uppercase"
                  style={{ color: 'rgba(248,244,237,0.55)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
