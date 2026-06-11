'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const PRODUCTS = [
  {
    id:       'morning-serenity',
    name:     'Morning Serenity',
    origin:   'Darjeeling, India',
    type:     'White Tea',
    weight:   '50g',
    price:    28,
    gradient: 'linear-gradient(155deg, #112a1e 0%, #1c4a30 55%, #254e38 100%)',
    accent:   '#8fcf9a',
    icon:     '☽',
    desc:     'First-flush white tea with honeyed sweetness, luminous golden liquor, and a long floral finish.',
  },
  {
    id:       'royal-assam',
    name:     'Royal Assam',
    origin:   'Assam, India',
    type:     'Black Tea',
    weight:   '100g',
    price:    22,
    gradient: 'linear-gradient(155deg, #1c0f06 0%, #3a1e0a 55%, #4e2a0e 100%)',
    accent:   '#d4883a',
    icon:     '♛',
    desc:     'Bold, malty second-flush Assam with a deep amber liquor and a brisk, satisfying finish.',
  },
  {
    id:       'ceremonial-matcha',
    name:     'Ceremonial Matcha',
    origin:   'Uji, Japan',
    type:     'Stone-Ground Matcha',
    weight:   '30g',
    price:    48,
    gradient: 'linear-gradient(155deg, #0a1e0d 0%, #163818 55%, #1d4f22 100%)',
    accent:   '#5cc870',
    icon:     '◈',
    desc:     'Shade-grown ceremonial grade. Intensely umami, vibrant jade colour, whisked to silken perfection.',
  },
  {
    id:       'himalayan-gold',
    name:     'Himalayan Gold',
    origin:   'Ilam, Nepal',
    type:     'Oolong Tea',
    weight:   '50g',
    price:    38,
    gradient: 'linear-gradient(155deg, #111008 0%, #2c2610 55%, #3e3418 100%)',
    accent:   '#D4B483',
    icon:     '✦',
    desc:     'High-altitude oolong with warm honey sweetness, a lingering orchid fragrance, and rare complexity.',
  },
]

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.0, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        transition: 'box-shadow 0.5s ease',
        boxShadow: hovered
          ? `0 28px 72px ${product.accent}28, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 4px 24px rgba(0,0,0,0.4)',
        border: `1px solid ${hovered ? product.accent + '40' : 'rgba(212,180,131,0.10)'}`,
      }}
    >
      {/* Visual area */}
      <div
        className="relative h-64 flex items-center justify-center overflow-hidden"
        style={{ background: product.gradient }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse 70% 60% at 50% 60%, ${product.accent}20 0%, transparent 70%)` }}
        />

        {/* Icon */}
        <motion.span
          className="text-6xl select-none"
          style={{ color: product.accent, opacity: 0.7 }}
          animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.12 : 1.0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {product.icon}
        </motion.span>

        {/* Type badge */}
        <div
          className="absolute top-4 right-4 text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 rounded-full"
          style={{
            background: `${product.accent}18`,
            border:     `1px solid ${product.accent}35`,
            color:      product.accent,
          }}
        >
          {product.type}
        </div>
      </div>

      {/* Text */}
      <div
        className="p-6"
        style={{ background: 'linear-gradient(180deg, rgba(13,31,26,0.95), #0a1810)' }}
      >
        <p className="text-[9px] tracking-[0.45em] uppercase mb-2" style={{ color: 'rgba(212,180,131,0.50)' }}>
          {product.origin}
        </p>
        <h3
          className="font-cinzel text-lg font-semibold mb-3 tracking-wide"
          style={{ color: '#F8F4ED' }}
        >
          {product.name}
        </h3>
        <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(248,244,237,0.48)' }}>
          {product.desc}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,180,131,0.50)' }}>
            {product.weight}
          </span>
          <div className="flex items-center gap-3">
            <span
              className="font-cinzel text-lg"
              style={{ color: product.accent }}
            >
              ${product.price}
            </span>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="text-[9px] tracking-[0.28em] uppercase px-4 py-2 rounded-full transition-all duration-300"
              style={{
                background: hovered ? `${product.accent}22` : 'transparent',
                border:     `1px solid ${product.accent}45`,
                color:      product.accent,
              }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CollectionSection() {
  return (
    <section
      id="collection"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D1F1A 0%, #0a1612 50%, #070e0b 100%)' }}
    >
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(46,90,72,0.15) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[10px] tracking-[0.55em] uppercase mb-4"
            style={{ color: 'rgba(212,180,131,0.55)' }}
          >
            Single Origin · Hand-Picked
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-cinzel text-4xl sm:text-5xl font-semibold tracking-wider mb-4"
            style={{ color: '#F8F4ED' }}
          >
            The Collection
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mx-auto h-px w-32 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #D4B483, transparent)' }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-12 text-[10px] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(212,180,131,0.28)' }}
        >
          Free worldwide shipping on orders above $60
        </motion.p>

      </div>
    </section>
  )
}
