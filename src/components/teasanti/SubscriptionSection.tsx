'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const BENEFITS = [
  { icon: '◈', label: 'Monthly Delivery',   desc: 'Curated seasonal blends delivered to your door.' },
  { icon: '✦', label: 'Exclusive Blends',   desc: 'Members-only small-batch teas, unavailable elsewhere.' },
  { icon: '◌', label: '15% Discount',       desc: 'On every order, every time. No exceptions.' },
  { icon: '☽', label: 'Priority Access',    desc: 'First to receive limited harvests and new arrivals.' },
]

export default function SubscriptionSection() {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSent(true)
  }

  return (
    <section
      id="story"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#0D1F1A' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(46,90,72,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Decorative top */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(212,180,131,0.22), transparent)' }} />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[10px] tracking-[0.55em] uppercase mb-5"
            style={{ color: 'rgba(212,180,131,0.55)' }}
          >
            The Inner Circle
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cinzel text-4xl sm:text-5xl font-semibold tracking-wider mb-5 leading-tight"
            style={{ color: '#F8F4ED' }}
          >
            Never Run Out Of<br />
            <span style={{
              background: 'linear-gradient(135deg, #D4B483, #f0d090, #c8a060)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Your Ritual
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: 'rgba(248,244,237,0.45)' }}
          >
            Join the TeaSanti subscription and let the ritual never be interrupted.
          </motion.p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.85, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-6 rounded-xl flex flex-col items-start gap-3 group"
              style={{
                background:  'rgba(46,90,72,0.10)',
                border:      '1px solid rgba(212,180,131,0.10)',
                transition:  'border-color 0.35s, background 0.35s',
              }}
              whileHover={{
                borderColor: 'rgba(212,180,131,0.30)',
                background:  'rgba(46,90,72,0.18)',
              } as any}
            >
              <span className="text-2xl" style={{ color: '#D4B483' }}>{b.icon}</span>
              <h4 className="font-cinzel text-sm font-semibold tracking-wide" style={{ color: '#F8F4ED' }}>
                {b.label}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(248,244,237,0.45)' }}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Email signup */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto text-center"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6"
            >
              <p className="font-cinzel text-xl mb-2" style={{ color: '#D4B483' }}>Welcome to the Circle</p>
              <p className="text-sm" style={{ color: 'rgba(248,244,237,0.50)' }}>
                Your first curated selection will arrive within 3–5 days.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 rounded-full text-sm outline-none transition-all duration-300"
                style={{
                  background:  'rgba(46,90,72,0.15)',
                  border:      '1px solid rgba(212,180,131,0.22)',
                  color:       '#F8F4ED',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,180,131,0.55)' }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(212,180,131,0.22)' }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-4 rounded-full text-[11px] tracking-[0.30em] uppercase font-medium whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #D4B483, #f0d090, #b8904a)',
                  color:      '#0D1F1A',
                  boxShadow:  '0 0 24px rgba(212,180,131,0.30)',
                }}
              >
                Join Free
              </motion.button>
            </form>
          )}

          <p className="mt-4 text-[10px] tracking-wide" style={{ color: 'rgba(248,244,237,0.28)' }}>
            Cancel anytime · No commitment · First box 20% off
          </p>
        </motion.div>

      </div>
    </section>
  )
}
