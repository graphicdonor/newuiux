'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'Showcase',     href: '#showcase' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
  { label: '3D Scene',     href: '/scene' },
  { label: 'Fantasy',      href: '/fantasy' },
]

export default function Navigation() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-[0_1px_0_rgba(255,255,255,0.04)] py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="font-cinzel text-[1.1rem] font-semibold tracking-[0.18em] gradient-text select-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          LUMINARY
        </motion.a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <motion.a
              key={label}
              href={href}
              className="text-[11px] tracking-[0.35em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              whileHover={{ y: -1 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>

        {/* CTA button */}
        <motion.button
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/30 text-[11px] tracking-[0.25em] uppercase text-purple-300/80 hover:text-purple-200 hover:border-purple-400/50 hover:bg-purple-500/8 transition-all duration-300"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Begin
        </motion.button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 group"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-px bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/5 glass"
          >
            <nav className="px-6 py-5 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] tracking-[0.35em] uppercase text-white/50 hover:text-white transition-colors"
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
