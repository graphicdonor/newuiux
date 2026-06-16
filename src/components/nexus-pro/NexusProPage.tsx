'use client'

/**
 * Teasanti — premium e-commerce tea landing page.
 *
 * Structure
 * ─────────
 * [Header]      fixed, transparent → frosted glass on scroll
 * [Pin 600vh]   scroll-scrubbed video + 4 cinematic text phases
 *   Phase 1  0.02–0.20  Hero:   TEASANTI + tagline
 *   Phase 2  0.26–0.42  Words:  PURE.  /  RARE.
 *   Phase 3  0.48–0.63  Quotes: altitude/silence  ·  craft/patience
 *   Phase 4  0.68–0.84  Brand:  Ancient gardens.  /  From soil to soul.
 * [Products]    6-card grid, staggered entrance
 * [CTA]         pinned 120vh
 *
 * Video: fetched as Blob → zero I/O seeks.
 * Motion: play-rate chasing (no forward seeks = no keyframe stall).
 */

import { useEffect, useRef, useState } from 'react'
import gsap                             from 'gsap'
import { ScrollTrigger }                from 'gsap/ScrollTrigger'
import ProductCard, { PRODUCTS }        from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

type VideoEl = HTMLVideoElement & { fastSeek?: (t: number) => void }

// ─── SVG icons ──────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)
const IconHeart = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const IconBag = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

// ─── Component ──────────────────────────────────────────────────────────────
export default function NexusProPage() {
  const [loadPct,  setLoadPct]  = useState(0)
  const [isReady,  setIsReady]  = useState(false)

  // layout refs
  const wrapRef      = useRef<HTMLDivElement>(null)
  const loaderRef    = useRef<HTMLDivElement>(null)
  const headerRef    = useRef<HTMLElement>(null)
  const pinRef       = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)

  // Phase 1 — hero
  const heroGroupRef = useRef<HTMLDivElement>(null)

  // Phase 2 — single words
  const w2LeftRef    = useRef<HTMLDivElement>(null)
  const w2RightRef   = useRef<HTMLDivElement>(null)

  // Phase 3 — quotes
  const w3LeftRef    = useRef<HTMLDivElement>(null)
  const w3RightRef   = useRef<HTMLDivElement>(null)

  // Phase 4 — slogans
  const w4LeftRef    = useRef<HTMLDivElement>(null)
  const w4RightRef   = useRef<HTMLDivElement>(null)

  // product section refs
  const prodSectionRef = useRef<HTMLElement>(null)
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([])

  // CTA refs
  const ctaRef       = useRef<HTMLElement>(null)
  const ctaGlowRef   = useRef<HTMLDivElement>(null)
  const ctaTitleRef  = useRef<HTMLHeadingElement>(null)
  const ctaSubRef    = useRef<HTMLParagraphElement>(null)
  const ctaBtnRef    = useRef<HTMLButtonElement>(null)

  // ── Phase 1: fetch video into Blob ─────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current as VideoEl
    video.pause()

    let blobUrl = ''
    ;(async () => {
      try {
        const res   = await fetch('/tea-video.mp4')
        const total = parseInt(res.headers.get('content-length') ?? '0', 10)
        const reader = res.body!.getReader()
        const chunks: Uint8Array<ArrayBuffer>[] = []
        let received = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          received += value.length
          if (total > 0) setLoadPct(Math.round((received / total) * 100))
        }

        const blob = new Blob(chunks, { type: 'video/mp4' })
        blobUrl   = URL.createObjectURL(blob)
        video.src = blobUrl
        video.load()

        await new Promise<void>((resolve) => {
          video.addEventListener('canplaythrough', () => resolve(), { once: true })
          const poll = setInterval(() => {
            if (video.readyState >= 4) { clearInterval(poll); resolve() }
          }, 200)
          setTimeout(() => { clearInterval(poll); resolve() }, 8000)
        })
      } catch {
        video.src = '/tea-video.mp4'
      }

      gsap.to(loaderRef.current, {
        opacity: 0, duration: 0.7, ease: 'power2.inOut',
        onComplete: () => setIsReady(true),
      })
    })()

    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [])

  // ── Phase 2: wire GSAP after video ready ──────────────────────────────
  useEffect(() => {
    if (!isReady) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = videoRef.current as VideoEl
    video.pause()

    // Header frost on scroll
    const onScroll = () => {
      const el = headerRef.current
      if (!el) return
      const frosted = window.scrollY > 50
      el.style.background         = frosted ? 'rgba(4,3,1,0.82)' : 'transparent'
      el.style.backdropFilter     = frosted ? 'blur(24px)' : 'none'
      ;(el.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = frosted ? 'blur(24px)' : 'none'
      el.style.borderBottom       = frosted ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Play-rate chasing
    let targetTime = 0, driveRAF = 0
    const ONE_FRAME = 1 / 30
    const driveVideo = () => {
      driveRAF = requestAnimationFrame(driveVideo)
      if (!video.duration || video.readyState < 2) return
      const diff = targetTime - video.currentTime
      if (Math.abs(diff) < ONE_FRAME) {
        if (!video.paused) video.pause()
        return
      }
      if (diff > 0) {
        const rate = Math.min(Math.max(diff * 14, 0.5), 8)
        if (Math.abs(video.playbackRate - rate) > 0.05) video.playbackRate = rate
        if (video.paused) video.play().catch(() => {})
      } else {
        if (!video.paused) video.pause()
        const t = Math.max(0, targetTime)
        if (video.fastSeek) video.fastSeek(t)
        else video.currentTime = t
      }
    }
    driveRAF = requestAnimationFrame(driveVideo)

    // Lenis
    let lenis: import('lenis').default | null = null
    ;(async () => {
      try {
        const { default: Lenis } = await import('lenis')
        lenis = new Lenis({ duration: 1.0, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 2 })
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => lenis!.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
      } catch { /* fallback */ }
    })()

    const gsapCtx = gsap.context(() => {

      /* ── Video scrub (pin + instant) ── */
      ScrollTrigger.create({
        trigger : pinRef.current,
        pin     : true,
        scrub   : true,
        start   : 'top top',
        end     : '+=600%',
        onUpdate: (self) => {
          if (video.duration) targetTime = self.progress * video.duration
        },
      })

      if (prefersReduced) return

      /* ── Overlay timeline (smooth scrub) ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger : pinRef.current,
          scrub   : 1.0,
          start   : 'top top',
          end     : '+=600%',
        },
      })

      // ── Phase 1: Hero ──────────────────────────────────────────────
      tl
        .fromTo(heroGroupRef.current,
          { opacity:0, y:30 }, { opacity:1, y:0, duration:0.16, ease:'power3.out' }, 0.02)
        .to(heroGroupRef.current,
          { opacity:0, y:-24, duration:0.14, ease:'power2.in' }, 0.20)

      // ── Phase 2: PURE / RARE ───────────────────────────────────────
        .fromTo(w2LeftRef.current,
          { opacity:0, x:-80, scale:0.85 },
          { opacity:1, x:0,   scale:1, duration:0.20, ease:'power3.out' }, 0.26)
        .fromTo(w2RightRef.current,
          { opacity:0, x:80, scale:0.85 },
          { opacity:1, x:0,  scale:1, duration:0.20, ease:'power3.out' }, 0.28)
        .to(w2LeftRef.current,
          { opacity:0, x:-40, duration:0.14, ease:'power2.in' }, 0.42)
        .to(w2RightRef.current,
          { opacity:0, x:40,  duration:0.14, ease:'power2.in' }, 0.42)

      // ── Phase 3: Quotes ────────────────────────────────────────────
        .fromTo(w3LeftRef.current,
          { opacity:0, y:28 }, { opacity:1, y:0, duration:0.18, ease:'power2.out' }, 0.48)
        .fromTo(w3RightRef.current,
          { opacity:0, y:28 }, { opacity:1, y:0, duration:0.18, ease:'power2.out' }, 0.50)
        .to([w3LeftRef.current, w3RightRef.current],
          { opacity:0, y:-16, duration:0.14, ease:'power2.in' }, 0.63)

      // ── Phase 4: Slogans ───────────────────────────────────────────
        .fromTo(w4LeftRef.current,
          { opacity:0, y:32, scale:0.95 },
          { opacity:1, y:0,  scale:1, duration:0.20, ease:'power3.out' }, 0.68)
        .fromTo(w4RightRef.current,
          { opacity:0, y:32, scale:0.95 },
          { opacity:1, y:0,  scale:1, duration:0.20, ease:'power3.out' }, 0.70)
        .to([w4LeftRef.current, w4RightRef.current],
          { opacity:0, duration:0.16, ease:'power1.in' }, 0.84)

        .to({}, { duration:0.16 }, 0.84)

      /* ── Product grid entrance ── */
      if (cardRefs.current.length) {
        gsap.fromTo(
          cardRefs.current.filter(Boolean),
          { opacity:0, y:55 },
          {
            opacity:1, y:0, stagger:0.10, duration:0.7, ease:'power2.out',
            scrollTrigger: {
              trigger : prodSectionRef.current,
              start   : 'top 70%',
              once    : true,
            },
          },
        )
      }

      /* ── CTA ── */
      const ctaTl = gsap.timeline({
        scrollTrigger: { trigger:ctaRef.current, pin:true, scrub:1.0, start:'top top', end:'+=120%' },
      })
      ctaTl
        .fromTo(ctaGlowRef.current,  { opacity:0, scale:0.5  }, { opacity:1, scale:1, duration:0.5,  ease:'power2.out'    }, 0)
        .fromTo(ctaTitleRef.current, { opacity:0, y:44       }, { opacity:1, y:0,     duration:0.38, ease:'power3.out'    }, 0.22)
        .fromTo(ctaSubRef.current,   { opacity:0, y:22       }, { opacity:1, y:0,     duration:0.32, ease:'power2.out'    }, 0.36)
        .fromTo(ctaBtnRef.current,   { opacity:0, scale:0.88 }, { opacity:1, scale:1, duration:0.32, ease:'back.out(1.4)' }, 0.48)

    }, wrapRef)

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(driveRAF)
      gsapCtx.revert()
      lenis?.destroy()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [isReady])

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef} className="bg-black text-white antialiased overflow-x-hidden">

      {/* ══ Loading screen ══════════════════════════════════════════════ */}
      {!isReady && (
        <div ref={loaderRef} className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black">
          <p className="mb-10 font-cinzel text-[26px] font-bold uppercase tracking-[0.3em] text-white/80">Teasanti</p>
          <div className="w-48 overflow-hidden rounded-full bg-white/[0.07]" style={{ height:2 }}>
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width:`${loadPct}%`, background:'linear-gradient(90deg,#c8a96e,#8aaa78)' }}
            />
          </div>
          <p className="mt-4 text-[11px] tabular-nums tracking-[0.18em] text-white/22">
            {loadPct < 100 ? `${loadPct}%` : 'Preparing…'}
          </p>
        </div>
      )}

      {/* ══ Header ══════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 px-6 py-4 transition-[background,border-color,backdrop-filter] duration-400 md:px-10"
        style={{ borderBottom:'1px solid transparent' }}
        role="banner"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

          {/* Logo */}
          <a href="/" aria-label="Teasanti home" className="font-cinzel text-[17px] font-bold uppercase tracking-[0.26em] text-white/90 transition-opacity hover:opacity-70">
            Teasanti
          </a>

          {/* Nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {['Collections','Our Story','Sourcing','Ritual Guide'].map(l => (
              <a
                key={l}
                href="#"
                className="text-[13px] font-light tracking-wide text-white/55 transition-colors duration-200 hover:text-white/90"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30" aria-label="Search">
              <IconSearch />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30" aria-label="Wishlist">
              <IconHeart />
            </button>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30" aria-label="Cart — 2 items">
              <IconBag />
              <span className="absolute right-1.5 top-1.5 flex h-[16px] w-[16px] items-center justify-center rounded-full text-[9px] font-semibold text-black" style={{ background:'#c8a96e' }}>
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ══ PINNED VIDEO SECTION ════════════════════════════════════════ */}
      <section ref={pinRef} className="relative h-screen w-full overflow-hidden bg-black" aria-label="Teasanti — scroll to explore">

        {/* Video (src set via Blob URL in useEffect) */}
        <video ref={videoRef} muted playsInline preload="none" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" style={{ zIndex:1 }} />

        {/* Legibility gradient */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background:'linear-gradient(to bottom,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.08) 45%,rgba(0,0,0,0.62) 100%)', zIndex:2 }} />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.022]" style={{ zIndex:3 }} />

        {/* Persistent brand watermark */}
        <div aria-hidden className="pointer-events-none absolute bottom-8 left-8 z-10" style={{ zIndex:15 }}>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.28em] text-white/18">Teasanti</p>
        </div>

        {/* ── Phase 1: Hero ── */}
        <div ref={heroGroupRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0" style={{ zIndex:20 }}>
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.34em]" style={{ color:'#c8a96e' }}>
            Est. 2024 · Premium Tea
          </p>
          <h1
            className="mb-5 text-center font-cinzel text-[clamp(58px,10.5vw,118px)] font-bold leading-none tracking-[-0.01em] text-white"
            style={{ textShadow:'0 4px 40px rgba(0,0,0,0.65)' }}
          >
            TEASANTI
          </h1>
          <div className="mb-5 h-px w-24 rounded-full" style={{ background:'linear-gradient(90deg,transparent,rgba(200,168,100,0.55),transparent)' }} />
          <p className="text-center text-[clamp(15px,1.8vw,22px)] font-light tracking-wide text-white/50">
            Ancient wisdom. Modern ritual.
          </p>
        </div>

        {/* ── Phase 2: PURE / RARE ── */}
        <div ref={w2LeftRef} className="pointer-events-none absolute left-[6vw] top-1/2 -translate-y-1/2 opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="font-cinzel text-[clamp(52px,7.5vw,96px)] font-bold leading-none text-white" style={{ textShadow:'0 2px 30px rgba(0,0,0,0.7)', letterSpacing:'-0.01em' }}>
            PURE.
          </p>
          <div className="mt-3 h-px w-16 rounded-full" style={{ background:'rgba(200,168,100,0.45)' }} />
        </div>
        <div ref={w2RightRef} className="pointer-events-none absolute right-[6vw] top-1/2 -translate-y-1/2 text-right opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="font-cinzel text-[clamp(52px,7.5vw,96px)] font-bold leading-none text-white" style={{ textShadow:'0 2px 30px rgba(0,0,0,0.7)', letterSpacing:'-0.01em' }}>
            RARE.
          </p>
          <div className="ml-auto mt-3 h-px w-16 rounded-full" style={{ background:'rgba(138,170,120,0.45)' }} />
        </div>

        {/* ── Phase 3: Quotes ── */}
        <div ref={w3LeftRef} className="pointer-events-none absolute left-[6vw] top-1/2 max-w-[260px] -translate-y-1/2 opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color:'#c8a96e' }}>
            Origin
          </p>
          <p className="text-[clamp(18px,2.4vw,30px)] font-light leading-[1.35] text-white/90" style={{ textShadow:'0 2px 22px rgba(0,0,0,0.85)' }}>
            Grown at altitude,<br />where silence<br />speaks first.
          </p>
        </div>
        <div ref={w3RightRef} className="pointer-events-none absolute right-[6vw] top-1/2 max-w-[260px] -translate-y-1/2 text-right opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color:'#8aaa78' }}>
            Craft
          </p>
          <p className="text-[clamp(18px,2.4vw,30px)] font-light leading-[1.35] text-white/90" style={{ textShadow:'0 2px 22px rgba(0,0,0,0.85)' }}>
            One thousand<br />hands shape<br />every cup.
          </p>
        </div>

        {/* ── Phase 4: Slogans ── */}
        <div ref={w4LeftRef} className="pointer-events-none absolute left-[6vw] top-1/2 max-w-[280px] -translate-y-1/2 opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="text-[clamp(22px,3.2vw,40px)] font-semibold leading-[1.25] text-white" style={{ textShadow:'0 3px 28px rgba(0,0,0,0.8)' }}>
            Ancient gardens.<br />Modern ritual.
          </p>
          <div className="mt-4 h-px w-20 rounded-full" style={{ background:'rgba(200,168,100,0.50)' }} />
        </div>
        <div ref={w4RightRef} className="pointer-events-none absolute right-[6vw] top-1/2 max-w-[280px] -translate-y-1/2 text-right opacity-0" style={{ zIndex:20, willChange:'transform,opacity' }} aria-hidden>
          <p className="text-[clamp(22px,3.2vw,40px)] font-semibold leading-[1.25] text-white" style={{ textShadow:'0 3px 28px rgba(0,0,0,0.8)' }}>
            From soil<br />to soul.
          </p>
          <div className="ml-auto mt-4 h-px w-20 rounded-full" style={{ background:'rgba(138,170,120,0.50)' }} />
        </div>

        {/* Scroll indicator */}
        <div aria-hidden className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2" style={{ zIndex:40 }}>
          <div className="h-[34px] w-[20px] rounded-full border border-white/18 p-[5px]">
            <div className="h-[6px] w-[3px] rounded-full bg-white/45" style={{ animation:'scrollDot 2s ease-in-out infinite' }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/22">Scroll</span>
        </div>
      </section>

      {/* ══ PRODUCT GRID SECTION ════════════════════════════════════════ */}
      <section ref={prodSectionRef} className="relative bg-black px-6 py-28 md:px-12" aria-label="Our Tea Collection">

        {/* Section header */}
        <div className="mx-auto mb-16 max-w-7xl">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.3em]" style={{ color:'#c8a96e' }}>
            Handpicked · Rare · Seasonal
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-cinzel text-[clamp(32px,5vw,58px)] font-bold leading-none tracking-[-0.01em] text-white">
                The Collection
              </h2>
              <p className="mt-3 max-w-md text-[15px] font-light leading-relaxed text-white/38">
                Sourced from the world&rsquo;s finest gardens. Every tea tells a story of place, season, and craft.
              </p>
            </div>
            {/* Category filters (decorative) */}
            <div className="flex flex-wrap gap-2">
              {['All','White Tea','Green Tea','Oolong','Pu-erh'].map((cat, i) => (
                <button
                  key={cat}
                  className="rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-200"
                  style={{
                    background: i === 0 ? 'rgba(200,168,100,0.14)' : 'rgba(255,255,255,0.04)',
                    color      : i === 0 ? '#c8a96e'               : 'rgba(255,255,255,0.38)',
                    border     : i === 0 ? '1px solid rgba(200,168,100,0.30)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 h-px w-full" style={{ background:'linear-gradient(90deg,rgba(200,168,100,0.20),rgba(138,170,120,0.12),transparent)' }} />
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { cardRefs.current[i] = el }}
              style={{ opacity: 0 }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-14 flex max-w-7xl justify-center">
          <a
            href="#"
            className="rounded-full border border-white/[0.14] px-8 py-3.5 text-[13px] font-medium text-white/55 transition-all duration-200 hover:border-white/28 hover:text-white/90"
          >
            View Full Collection →
          </a>
        </div>
      </section>

      {/* ══ CTA SECTION ═════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-6" aria-label="Begin your ritual">
        <div ref={ctaGlowRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ background:'radial-gradient(ellipse at 50% 55%,rgba(80,55,10,0.35) 0%,rgba(40,100,20,0.10) 40%,transparent 70%)', willChange:'transform,opacity' }} />

        {[...Array(24)].map((_, i) => (
          <div key={i} aria-hidden className="pointer-events-none absolute rounded-full" style={{ width:1+(i%3)*0.6, height:1+(i%3)*0.6, left:`${5+(i*4.1)%90}%`, top:`${5+(i*7.3)%88}%`, opacity:0.05+(i%5)*0.030, background:i%2===0?'rgba(200,168,100,1)':'rgba(110,160,90,1)' }} />
        ))}

        <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.3em]" style={{ color:'#c8a96e' }}>Begin Your Journey</p>

          <h2 ref={ctaTitleRef} className="mb-4 font-cinzel text-[clamp(42px,7.5vw,88px)] font-bold leading-none tracking-[-0.01em] text-white opacity-0" style={{ willChange:'transform,opacity' }}>
            TEASANTI
          </h2>

          <div className="mb-8 h-px w-28 rounded-full" style={{ background:'linear-gradient(90deg,transparent,rgba(200,168,100,0.5),transparent)' }} />

          <p ref={ctaSubRef} className="mb-12 text-[clamp(15px,1.7vw,20px)] font-light leading-relaxed text-white/40 opacity-0" style={{ willChange:'transform,opacity' }}>
            Six exceptional teas. One ancient tradition.<br />
            Free worldwide delivery from&nbsp;<span className="font-medium text-white/70">$48.</span>
          </p>

          <button
            ref={ctaBtnRef}
            className="group relative min-h-[54px] overflow-hidden rounded-full px-10 text-[14px] font-semibold text-white opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400/60"
            style={{ background:'linear-gradient(135deg,rgba(100,70,10,0.85) 0%,rgba(50,80,20,0.80) 100%)', border:'1px solid rgba(200,168,100,0.38)', boxShadow:'0 0 0 1px rgba(200,168,100,0.12),0 8px 28px rgba(80,50,5,0.38)', willChange:'transform,opacity' }}
            aria-label="Shop Teasanti teas"
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 60%)' }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow:'0 0 32px rgba(200,168,100,0.38)', animation:'ctaGlowPulse 3s ease-in-out infinite' }} />
            <span className="relative z-10">Shop the Collection</span>
          </button>

          <p className="mt-7 text-[11px] text-white/18">Free worldwide delivery · 30-day returns · Ethically sourced</p>
        </div>

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.05] px-8 py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <span className="font-cinzel text-[12px] font-bold uppercase tracking-[0.28em] text-white/20">Teasanti</span>
            <div className="flex flex-wrap gap-5">
              {['Collections','Our Story','Sourcing','Ritual Guide','Privacy','Contact'].map(l => (
                <a key={l} href="#" className="text-[11px] text-white/20 transition-colors hover:text-white/45">{l}</a>
              ))}
            </div>
            <span className="text-[10px] text-white/14">© 2026 Teasanti Co. All rights reserved.</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollDot {
          0%,100%{ transform:translateY(0);    opacity:0.45; }
          50%    { transform:translateY(11px); opacity:1;    }
        }
        @keyframes ctaGlowPulse {
          0%,100%{ opacity:0.45; }
          50%    { opacity:1.00; }
        }
      `}</style>
    </div>
  )
}
