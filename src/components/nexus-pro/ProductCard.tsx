'use client'

import Image           from 'next/image'
import { useRef, type MouseEvent } from 'react'

export interface ProductData {
  id         : string
  edition    : string
  tagline    : string
  description: string
  price      : string
  accentHex  : string
  glowRgba   : string
  category   : string
  imageSrc   : string
}

export const PRODUCTS: ProductData[] = [
  {
    id         : 'herbal-green',
    edition    : 'Herbal Green Tea',
    tagline    : 'Pure · Balanced · Refreshing',
    category   : 'Green Tea',
    description: 'Premium green leaves with hand-selected herbs. Rich in antioxidants. Naturally soothing.',
    price      : '$42',
    accentHex  : '#7dbb7d',
    glowRgba   : 'rgba(100,180,100,0.22)',
    imageSrc   : '/products/tea-herbal-green.png',
  },
  {
    id         : 'rose-hibiscus',
    edition    : 'Rose Green Tea',
    tagline    : 'Floral · Antioxidant · Refreshing',
    category   : 'Hibiscus Blend',
    description: 'Vibrant hibiscus petals with silky green tea. Deep crimson, tangy, beautifully floral.',
    price      : '$48',
    accentHex  : '#c8969b',
    glowRgba   : 'rgba(200,140,150,0.22)',
    imageSrc   : '/products/tea-rose-hibiscus.png',
  },
  {
    id         : 'jasmine-green',
    edition    : 'Jasmine Green Tea',
    tagline    : 'Floral · Smooth · Revitalizing',
    category   : 'Green Tea',
    description: 'High-mountain green tea scented with fresh jasmine blossoms over three nights. Silky, luminous.',
    price      : '$52',
    accentHex  : '#8aaa78',
    glowRgba   : 'rgba(90,130,80,0.22)',
    imageSrc   : '/products/tea-jasmine-green.png',
  },
  {
    id         : 'lemon-ginger',
    edition    : 'Lemon Ginger Tea',
    tagline    : 'Zesty · Warming · Refreshing',
    category   : 'Green Tea',
    description: 'Bold Himalayan ginger meets sun-ripened lemon. Zesty, warming, aids digestion perfectly.',
    price      : '$38',
    accentHex  : '#c8a96e',
    glowRgba   : 'rgba(200,168,100,0.22)',
    imageSrc   : '/products/tea-lemon-ginger.png',
  },
]

const MAX_TILT = 10
const SCALE_UP = 1.03

export default function ProductCard({ product }: { product: ProductData }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const px = (e.clientX - left) / width
    const py = (e.clientY - top)  / height
    const rx = -(py - 0.5) * MAX_TILT
    const ry =  (px - 0.5) * MAX_TILT
    el.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${SCALE_UP},${SCALE_UP},${SCALE_UP})`
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${px * 100}% ${py * 100}%, ${product.glowRgba} 0%, transparent 65%)`
    }
  }

  const onMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glowRef.current) glowRef.current.style.background = 'none'
  }

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`${product.edition} — ${product.tagline}`}
      className="relative w-[260px] cursor-pointer select-none"
      style={{
        transformStyle: 'preserve-3d',
        transition    : 'transform 0.36s cubic-bezier(0.17,0.67,0.5,1.1)',
        willChange    : 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-[20px] border border-white/[0.08]"
        style={{
          background : 'linear-gradient(160deg, rgba(14,12,6,0.96) 0%, rgba(6,5,2,0.98) 100%)',
          boxShadow  : '0 24px 60px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Glow layer */}
        <div ref={glowRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[20px] z-10 transition-all duration-200" />

        {/* Top accent line */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px z-10" style={{ background: `linear-gradient(90deg, transparent, ${product.accentHex}66, transparent)` }} />

        {/* Product image */}
        <div className="relative h-[300px] overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(20,18,10,0.8) 0%, rgba(4,3,1,1) 80%)' }}>
          <Image
            src={product.imageSrc}
            alt={product.edition}
            fill
            className="object-contain"
            sizes="260px"
            priority={false}
          />
          {/* Bottom fade into card body */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: 'linear-gradient(to top, rgba(6,5,2,0.98) 0%, transparent 100%)' }} />
        </div>

        {/* Info */}
        <div className="px-5 pb-5 pt-3">
          {/* Category badge */}
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] mb-2.5"
            style={{ background: `${product.accentHex}18`, color: product.accentHex, border: `1px solid ${product.accentHex}33` }}
          >
            {product.category}
          </span>

          <h3 className="mb-1 text-[17px] font-semibold leading-snug text-white">{product.edition}</h3>
          <p className="mb-1 text-[11px] font-medium tracking-wide" style={{ color: `${product.accentHex}bb` }}>{product.tagline}</p>
          <p className="mb-4 text-[12px] leading-relaxed text-white/35">{product.description}</p>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[16px] font-semibold text-white">{product.price}</span>
            <button
              className="min-h-[44px] flex-1 rounded-full border border-white/[0.12] text-[12px] font-medium text-white/55 transition-all duration-200 hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 active:scale-95"
              style={{ background: `${product.accentHex}0d` }}
              aria-label={`Add ${product.edition} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
