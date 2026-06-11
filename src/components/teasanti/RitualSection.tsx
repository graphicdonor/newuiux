'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STEPS = [
  {
    num:   '01',
    name:  'Boil Water',
    icon:  '〰',
    temp:  '95°C / 203°F',
    desc:  'Use filtered water. Bring to 95°C for black and oolong — a gentle 80°C for white and green. Temperature is everything.',
    note:  'Never use boiling water on delicate teas.',
    color: '#D4B483',
  },
  {
    num:   '02',
    name:  'Prepare Leaves',
    icon:  '✿',
    temp:  '2g per 200ml',
    desc:  'Measure your leaves with intention. Rinse your vessel with hot water to warm the clay. Observe the dry leaf — its colour, its scent.',
    note:  'Gongfu style: 5g in 100ml for deeper flavour.',
    color: '#8fcf9a',
  },
  {
    num:   '03',
    name:  'Brew',
    icon:  '◉',
    temp:  '2 – 3 Minutes',
    desc:  'Cover and steep in silence. Watch the water transform. The liquor will tell you when it is ready — trust the colour.',
    note:  'Each subsequent steep can be extended by 30 seconds.',
    color: '#D4B483',
  },
  {
    num:   '04',
    name:  'Sip & Relax',
    icon:  '◌',
    temp:  'Present Moment',
    desc:  'Hold the cup with both hands. Feel the warmth. Take three conscious sips before conversation. This is your ritual.',
    note:  'The same leaves can be steeped 3–5 times.',
    color: '#8fcf9a',
  },
]

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 1.1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      {/* Step number */}
      <div
        className="font-cinzel text-[5rem] leading-none font-semibold mb-6 select-none"
        style={{ color: `${step.color}18` }}
      >
        {step.num}
      </div>

      {/* Icon */}
      <motion.div
        className="text-3xl mb-5"
        style={{ color: step.color }}
        whileInView={{ scale: [0.7, 1.1, 1.0] }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
      >
        {step.icon}
      </motion.div>

      {/* Title + temp */}
      <h3
        className="font-cinzel text-xl font-semibold mb-1 tracking-wide"
        style={{ color: '#F8F4ED' }}
      >
        {step.name}
      </h3>
      <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: step.color, opacity: 0.75 }}>
        {step.temp}
      </p>

      {/* Divider */}
      <div className="h-px mb-5 w-12" style={{ background: `linear-gradient(to right, ${step.color}60, transparent)` }} />

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(248,244,237,0.52)' }}>
        {step.desc}
      </p>

      {/* Note */}
      <p className="text-[11px] italic" style={{ color: `${step.color}70` }}>
        {step.note}
      </p>

      {/* Connector arrow — not on last */}
      {index < STEPS.length - 1 && (
        <div
          className="hidden xl:block absolute top-28 -right-3 text-lg"
          style={{ color: 'rgba(212,180,131,0.20)' }}
        >
          →
        </div>
      )}
    </motion.div>
  )
}

export default function RitualSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      id="ritual"
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#070e0b' }}
    >
      {/* Parallax radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: bgY,
          background: 'radial-gradient(ellipse 60% 55% at 50% 60%, rgba(212,180,131,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(212,180,131,0.25), transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[10px] tracking-[0.55em] uppercase mb-5"
            style={{ color: 'rgba(212,180,131,0.55)' }}
          >
            The Ancient Method
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cinzel text-4xl sm:text-5xl font-semibold tracking-wider mb-4"
            style={{ color: '#F8F4ED' }}
          >
            The Tea Ritual
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mx-auto h-px w-32 origin-center mb-5"
            style={{ background: 'linear-gradient(90deg, transparent, #D4B483, transparent)' }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: 'rgba(248,244,237,0.42)' }}
          >
            Slow down. Follow these four steps and transform your cup into a meditation.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-8">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-20"
        >
          <p
            className="font-playfair text-xl sm:text-2xl italic max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(212,180,131,0.60)' }}
          >
            "Tea is not a beverage. It is a conversation between the leaf and the water,
            and you are the silent witness."
          </p>
          <cite className="block mt-4 text-[9px] tracking-[0.5em] uppercase not-italic"
                style={{ color: 'rgba(248,244,237,0.28)' }}>
            — TeaSanti Philosophy
          </cite>
        </motion.blockquote>

      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(212,180,131,0.20), transparent)' }} />
    </section>
  )
}
