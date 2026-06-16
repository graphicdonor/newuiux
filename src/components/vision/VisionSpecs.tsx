'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPECS = [
  { label: 'Chip',          value: 'M3 Ultra + Neural Engine (38 TOPS)' },
  { label: 'Display',       value: 'Dual micro-OLED, 3660 × 3200 per eye' },
  { label: 'Resolution',    value: '23 million pixels per eye' },
  { label: 'Refresh Rate',  value: '120 Hz ProMotion with variable rate' },
  { label: 'Eye Tracking',  value: 'High-speed IR cameras + LEDs' },
  { label: 'Audio',         value: '6-driver Spatial Audio, ANC' },
  { label: 'Input',         value: 'Eyes, hands, voice, neural gestures' },
  { label: 'Connectivity',  value: 'Wi-Fi 7, Bluetooth 5.3, Ultra Wideband' },
  { label: 'Storage',       value: '512 GB · 1 TB · 2 TB' },
  { label: 'Battery Life',  value: 'Up to 12 hours (external pack)' },
  { label: 'Weight',        value: '400 g — headset only' },
  { label: 'OS',            value: 'visionOS 2' },
]

export default function VisionSpecs() {
  const headerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })
  const tableInView = useInView(tableRef, { once: true, amount: 0.1 })

  return (
    <section id="specs" className="bg-black pt-28 pb-36 px-6 border-t border-white/[0.05]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[#0071e3] text-[13px] font-medium tracking-[0.28em] uppercase mb-5">
            Technical
          </p>
          <h2 className="text-[clamp(34px,5vw,56px)] font-bold text-white tracking-tight leading-tight">
            Specifications
          </h2>
        </motion.div>

        {/* Spec rows */}
        <div ref={tableRef}>
          {SPECS.map((spec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={tableInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-baseline justify-between py-5 border-b border-white/[0.06] gap-6"
            >
              <span className="text-white/38 text-[14px] font-medium shrink-0 w-36">{spec.label}</span>
              <span className="text-white text-[14px] font-medium text-right">{spec.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={tableInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-white/20 text-[12px] leading-relaxed"
        >
          Specifications subject to change. Battery life varies by usage and settings.
          Testing conducted with specific tasks and may differ from actual user experience.
        </motion.p>
      </div>
    </section>
  )
}
