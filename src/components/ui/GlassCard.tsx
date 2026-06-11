'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type GlowColor = 'purple' | 'pink' | 'gold'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: GlowColor
  delay?: number
  hover?: boolean
}

const borderHover: Record<GlowColor, string> = {
  purple: 'hover:border-purple-500/35 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]',
  pink:   'hover:border-pink-500/35   hover:shadow-[0_0_30px_rgba(236,72,153,0.12)]',
  gold:   'hover:border-amber-400/35  hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]',
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'purple',
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -5, scale: 1.012 } : undefined}
      className={`
        glass rounded-2xl border border-white/5
        transition-all duration-500
        ${borderHover[glowColor]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
