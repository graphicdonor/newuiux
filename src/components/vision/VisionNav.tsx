'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const navLinks = ['Features', 'Display', 'Specs', 'Order']

export default function VisionNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/75 backdrop-blur-2xl border-b border-white/[0.06]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[52px] flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="/vision"
          className="text-white text-sm font-semibold tracking-[0.28em] uppercase hover:text-white/80 transition-colors"
        >
          NEXUS
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/55 text-[13px] hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Order CTA */}
        <a
          href="#order"
          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Order
        </a>
      </div>
    </motion.nav>
  )
}
