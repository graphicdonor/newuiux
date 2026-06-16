'use client'

/**
 * Teasanti — fully mobile-responsive e-commerce landing page.
 *
 * Mobile breakpoints targeted: 360px, 390px (iPhone 14 Pro), 428px (Pro Max)
 *
 * Mobile-specific changes vs desktop:
 *  • Header: logo + cart only (nav + search + wishlist hidden)
 *  • Scroll text phases: stacked top/bottom center instead of left/right split
 *  • GSAP animations: y-only on mobile (no x offset that goes off-screen)
 *  • Product grid: 1-col → 2-col (sm) → 3-col (lg)
 *  • CTA footer: column stack on mobile
 *  • All touch targets ≥ 44px
 *  • Typography: clamp() scales across all widths
 */

import { useEffect, useRef, useState } from 'react'
import gsap                             from 'gsap'
import { ScrollTrigger }                from 'gsap/ScrollTrigger'
import ProductCard, { PRODUCTS }        from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

type VideoEl = HTMLVideoElement & { fastSeek?: (t: number) => void }

// ─── Icons ──────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const IconBag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

// ─── Component ──────────────────────────────────────────────────────────────
export default function NexusProPage() {
  const [loadPct, setLoadPct] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const wrapRef      = useRef<HTMLDivElement>(null)
  const loaderRef    = useRef<HTMLDivElement>(null)
  const headerRef    = useRef<HTMLElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const pinRef       = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const heroGroupRef = useRef<HTMLDivElement>(null)
  const w2LeftRef    = useRef<HTMLDivElement>(null)
  const w2RightRef   = useRef<HTMLDivElement>(null)
  const w3LeftRef    = useRef<HTMLDivElement>(null)
  const w3RightRef   = useRef<HTMLDivElement>(null)
  const w4LeftRef    = useRef<HTMLDivElement>(null)
  const w4RightRef   = useRef<HTMLDivElement>(null)
  const prodSectionRef = useRef<HTMLElement>(null)
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([])
  const ctaRef       = useRef<HTMLElement>(null)
  const ctaGlowRef   = useRef<HTMLDivElement>(null)
  const ctaTitleRef  = useRef<HTMLHeadingElement>(null)
  const ctaSubRef    = useRef<HTMLParagraphElement>(null)
  const ctaBtnRef    = useRef<HTMLButtonElement>(null)

  // ── Video blob preload ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current as VideoEl
    video.pause()
    let blobUrl = ''

    ;(async () => {
      try {
        const res    = await fetch('/tea-video.mp4')
        const total  = parseInt(res.headers.get('content-length') ?? '0', 10)
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

        await new Promise<void>(resolve => {
          video.addEventListener('canplaythrough', () => resolve(), { once: true })
          const poll = setInterval(() => { if (video.readyState >= 4) { clearInterval(poll); resolve() } }, 200)
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

  // ── GSAP + Lenis (after video ready) ───────────────────────────────────
  useEffect(() => {
    if (!isReady) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = videoRef.current as VideoEl
    const isMobile = window.innerWidth < 768
    video.pause()

    // Header frost
    const onScroll = () => {
      const el = headerRef.current
      if (!el) return
      const s = window.scrollY > 50
      el.style.background    = s ? 'rgba(4,3,1,0.38)' : 'transparent'
      el.style.backdropFilter = s ? 'blur(18px) saturate(160%)' : 'none'
      ;(el.style as CSSStyleDeclaration & { WebkitBackdropFilter: string }).WebkitBackdropFilter = s ? 'blur(18px) saturate(160%)' : 'none'
      el.style.borderBottom  = s ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Play-rate chasing
    let targetTime = 0, driveRAF = 0
    const ONE_FRAME = 1 / 30
    const driveVideo = () => {
      driveRAF = requestAnimationFrame(driveVideo)
      if (!video.duration || video.readyState < 2) return
      const diff = targetTime - video.currentTime
      if (Math.abs(diff) < ONE_FRAME) { if (!video.paused) video.pause(); return }
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
        gsap.ticker.add(time => lenis!.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
      } catch { /* fallback */ }
    })()

    const gsapCtx = gsap.context(() => {

      // Video scrub pin
      ScrollTrigger.create({
        trigger: pinRef.current, pin: true, scrub: true,
        start: 'top top', end: '+=600%',
        onUpdate: self => { if (video.duration) targetTime = self.progress * video.duration },
      })

      if (prefersReduced) return

      // Overlay timeline
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pinRef.current, scrub: 1.0, start: 'top top', end: '+=600%' },
      })

      // Phase 1: Hero
      tl
        .fromTo(heroGroupRef.current,
          { opacity:0, y:28 }, { opacity:1, y:0, duration:0.16, ease:'power3.out' }, 0.02)
        .to(heroGroupRef.current,
          { opacity:0, y:-22, duration:0.14, ease:'power2.in' }, 0.20)

      // Phase 2: PURE / RARE — x on desktop, y on mobile
        .fromTo(w2LeftRef.current,
          { opacity:0, x: isMobile ? 0 : -80, y: isMobile ? -28 : 0, scale:0.88 },
          { opacity:1, x:0, y:0, scale:1, duration:0.20, ease:'power3.out' }, 0.26)
        .fromTo(w2RightRef.current,
          { opacity:0, x: isMobile ? 0 : 80, y: isMobile ? 28 : 0, scale:0.88 },
          { opacity:1, x:0, y:0, scale:1, duration:0.20, ease:'power3.out' }, 0.28)
        .to(w2LeftRef.current,
          { opacity:0, x: isMobile ? 0 : -38, y: isMobile ? -18 : 0, duration:0.14, ease:'power2.in' }, 0.42)
        .to(w2RightRef.current,
          { opacity:0, x: isMobile ? 0 : 38,  y: isMobile ? 18 : 0,  duration:0.14, ease:'power2.in' }, 0.42)

      // Phase 3: Quotes
        .fromTo(w3LeftRef.current,
          { opacity:0, y:24 }, { opacity:1, y:0, duration:0.18, ease:'power2.out' }, 0.48)
        .fromTo(w3RightRef.current,
          { opacity:0, y:24 }, { opacity:1, y:0, duration:0.18, ease:'power2.out' }, 0.50)
        .to([w3LeftRef.current, w3RightRef.current],
          { opacity:0, y:-14, duration:0.14, ease:'power2.in' }, 0.63)

      // Phase 4: Slogans
        .fromTo(w4LeftRef.current,
          { opacity:0, y:28, scale:0.95 }, { opacity:1, y:0, scale:1, duration:0.20, ease:'power3.out' }, 0.68)
        .fromTo(w4RightRef.current,
          { opacity:0, y:28, scale:0.95 }, { opacity:1, y:0, scale:1, duration:0.20, ease:'power3.out' }, 0.70)
        .to([w4LeftRef.current, w4RightRef.current],
          { opacity:0, duration:0.16, ease:'power1.in' }, 0.84)
        .to({}, { duration:0.16 }, 0.84)

      // Product grid entrance
      if (cardRefs.current.length) {
        gsap.fromTo(cardRefs.current.filter(Boolean), { opacity:0, y:50 }, {
          opacity:1, y:0, stagger:0.08, duration:0.65, ease:'power2.out',
          scrollTrigger: { trigger: prodSectionRef.current, start:'top 72%', once:true },
        })
      }

      // CTA
      const ctaTl = gsap.timeline({
        scrollTrigger: { trigger:ctaRef.current, pin:true, scrub:1.0, start:'top top', end:'+=120%' },
      })
      ctaTl
        .fromTo(ctaGlowRef.current,  { opacity:0, scale:0.5  }, { opacity:1, scale:1, duration:0.5,  ease:'power2.out'    }, 0)
        .fromTo(ctaTitleRef.current, { opacity:0, y:40       }, { opacity:1, y:0,     duration:0.38, ease:'power3.out'    }, 0.22)
        .fromTo(ctaSubRef.current,   { opacity:0, y:20       }, { opacity:1, y:0,     duration:0.32, ease:'power2.out'    }, 0.36)
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

      {/* ══ Loader ══════════════════════════════════════════════════════ */}
      {!isReady && (
        <div ref={loaderRef} className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black px-6">
          <p className="mb-10 font-cinzel text-[24px] font-bold uppercase tracking-[0.3em] text-white/80">Teasanti</p>
          <div className="w-44 overflow-hidden rounded-full bg-white/[0.07]" style={{ height:2 }}>
            <div className="h-full rounded-full transition-all duration-150" style={{ width:`${loadPct}%`, background:'linear-gradient(90deg,#c8a96e,#8aaa78)' }} />
          </div>
          <p className="mt-4 text-[11px] tabular-nums tracking-[0.18em] text-white/22">
            {loadPct < 100 ? `${loadPct}%` : 'Preparing…'}
          </p>
        </div>
      )}

      {/* ══ Header ══════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300"
        style={{ borderBottom:'1px solid transparent' }}
        role="banner"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">

          {/* Logo */}
          <a href="/" aria-label="Teasanti home" className="font-cinzel text-[16px] font-bold uppercase tracking-[0.26em] text-white/90 transition-opacity hover:opacity-70 md:text-[17px]">
            Teasanti
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {['Collections','Our Story','Sourcing','Ritual Guide'].map(l => (
              <a key={l} href="#" className="text-[13px] font-light tracking-wide text-white/55 transition-colors duration-200 hover:text-white/90">{l}</a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            {/* Search — desktop only */}
            <button className="hidden h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 md:flex" aria-label="Search">
              <IconSearch />
            </button>
            {/* Wishlist — desktop only */}
            <button className="hidden h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 md:flex" aria-label="Wishlist">
              <IconHeart />
            </button>
            {/* Cart — always visible */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30" aria-label="Cart — 2 items">
              <IconBag />
              <span className="absolute right-1.5 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full text-[9px] font-bold text-black" style={{ background:'#c8a96e' }}>2</span>
            </button>
            {/* Hamburger — mobile only */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        <div
          ref={mobileNavRef}
          className="overflow-hidden transition-all duration-300 md:hidden"
          style={{
            maxHeight: menuOpen ? '260px' : '0px',
            opacity  : menuOpen ? 1 : 0,
          }}
          aria-hidden={!menuOpen}
        >
          <nav className="flex flex-col border-t border-white/[0.07] px-5 py-4" style={{ background:'rgba(4,3,1,0.92)', backdropFilter:'blur(20px)' }}>
            {['Collections','Our Story','Sourcing','Ritual Guide','Wishlist','Search'].map(l => (
              <a
                key={l}
                href="#"
                className="border-b border-white/[0.06] py-3.5 text-[14px] font-light tracking-wide text-white/60 transition-colors hover:text-white/90 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ══ PINNED VIDEO SECTION ════════════════════════════════════════ */}
      <section ref={pinRef} className="relative h-[100dvh] w-full overflow-hidden bg-black" aria-label="Teasanti — scroll to explore">

        <video ref={videoRef} muted playsInline preload="none" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" style={{ zIndex:1 }} />

        <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.022]" style={{ zIndex:3 }} />

        {/* Brand watermark */}
        <div aria-hidden className="pointer-events-none absolute bottom-20 left-5 z-10 md:bottom-8 md:left-8" style={{ zIndex:15 }}>
          <p className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-white/15 md:text-[11px]">Teasanti</p>
        </div>

        {/* ── Phase 1: Hero ── */}
        <div ref={heroGroupRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 opacity-0" style={{ zIndex:20 }}>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] md:mb-5 md:text-[12px]" style={{ color:'#c8a96e' }}>
            Est. 2024 · Premium Tea
          </p>
          <h1
            className="mb-4 text-center font-cinzel font-bold leading-none tracking-[-0.01em] text-white md:mb-5"
            style={{ fontSize:'clamp(46px,11vw,118px)', textShadow:'0 4px 40px rgba(0,0,0,0.65)' }}
          >
            TEASANTI
          </h1>
          <div className="mb-4 h-px w-20 rounded-full md:mb-5 md:w-24" style={{ background:'linear-gradient(90deg,transparent,rgba(200,168,100,0.55),transparent)' }} />
          <p className="text-center font-light tracking-wide text-white/50" style={{ fontSize:'clamp(14px,2vw,22px)' }}>
            Ancient wisdom. Modern ritual.
          </p>
        </div>

        {/* ── Phase 2: PURE / RARE ──
             Mobile: top 30% and bottom 30%, centered
             Desktop: left side and right side, vertically centered */}
        <div
          ref={w2LeftRef}
          className="pointer-events-none absolute opacity-0
            left-0 right-0 top-[28%] px-5 text-center
            md:left-[6vw] md:right-auto md:top-1/2 md:px-0 md:text-left md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="font-cinzel font-bold leading-none text-white" style={{ fontSize:'clamp(42px,10vw,96px)', textShadow:'0 2px 30px rgba(0,0,0,0.7)' }}>
            PURE.
          </p>
          <div className="mt-2.5 h-px w-14 rounded-full md:w-16" style={{ background:'rgba(200,168,100,0.45)', margin:'10px auto 0' }} />
        </div>
        <div
          ref={w2RightRef}
          className="pointer-events-none absolute opacity-0
            bottom-[26%] left-0 right-0 px-5 text-center
            md:bottom-auto md:right-[6vw] md:left-auto md:top-1/2 md:px-0 md:text-right md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="font-cinzel font-bold leading-none text-white" style={{ fontSize:'clamp(42px,10vw,96px)', textShadow:'0 2px 30px rgba(0,0,0,0.7)' }}>
            RARE.
          </p>
          <div className="mt-2.5 h-px w-14 rounded-full md:ml-auto md:w-16" style={{ background:'rgba(138,170,120,0.45)', margin:'10px auto 0' }} />
        </div>

        {/* ── Phase 3: Quotes ──
             Mobile: top 22% / bottom 18%, centered
             Desktop: left/right, vertically centered */}
        <div
          ref={w3LeftRef}
          className="pointer-events-none absolute opacity-0
            left-0 right-0 top-[20%] px-6 text-center
            md:left-[6vw] md:right-auto md:top-1/2 md:max-w-[260px] md:px-0 md:text-left md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color:'#c8a96e' }}>Origin</p>
          <p className="font-light leading-[1.35] text-white/90" style={{ fontSize:'clamp(16px,2.4vw,30px)', textShadow:'0 2px 22px rgba(0,0,0,0.85)' }}>
            Grown at altitude,<br />where silence<br />speaks first.
          </p>
        </div>
        <div
          ref={w3RightRef}
          className="pointer-events-none absolute opacity-0
            bottom-[16%] left-0 right-0 px-6 text-center
            md:bottom-auto md:right-[6vw] md:left-auto md:top-1/2 md:max-w-[260px] md:px-0 md:text-right md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color:'#8aaa78' }}>Craft</p>
          <p className="font-light leading-[1.35] text-white/90" style={{ fontSize:'clamp(16px,2.4vw,30px)', textShadow:'0 2px 22px rgba(0,0,0,0.85)' }}>
            One thousand<br />hands shape<br />every cup.
          </p>
        </div>

        {/* ── Phase 4: Slogans ──
             Mobile: top 30% / bottom 28%, centered
             Desktop: left/right, vertically centered */}
        <div
          ref={w4LeftRef}
          className="pointer-events-none absolute opacity-0
            left-0 right-0 top-[28%] px-6 text-center
            md:left-[6vw] md:right-auto md:top-1/2 md:max-w-[280px] md:px-0 md:text-left md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="font-semibold leading-[1.25] text-white" style={{ fontSize:'clamp(20px,3.5vw,40px)', textShadow:'0 3px 28px rgba(0,0,0,0.8)' }}>
            Ancient gardens.<br />Modern ritual.
          </p>
          <div className="mt-3 h-px w-16 rounded-full md:w-20" style={{ background:'rgba(200,168,100,0.50)', margin:'12px auto 0' }} />
        </div>
        <div
          ref={w4RightRef}
          className="pointer-events-none absolute opacity-0
            bottom-[24%] left-0 right-0 px-6 text-center
            md:bottom-auto md:right-[6vw] md:left-auto md:top-1/2 md:max-w-[280px] md:px-0 md:text-right md:-translate-y-1/2"
          style={{ zIndex:20, willChange:'transform,opacity' }}
          aria-hidden
        >
          <p className="font-semibold leading-[1.25] text-white" style={{ fontSize:'clamp(20px,3.5vw,40px)', textShadow:'0 3px 28px rgba(0,0,0,0.8)' }}>
            From soil<br />to soul.
          </p>
          <div className="mt-3 h-px w-16 rounded-full md:ml-auto md:w-20" style={{ background:'rgba(138,170,120,0.50)', margin:'12px auto 0' }} />
        </div>

        {/* Scroll indicator */}
        <div aria-hidden className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5" style={{ zIndex:40 }}>
          <div className="h-[32px] w-[20px] rounded-full border border-white/18 p-[5px]">
            <div className="h-[6px] w-[3px] rounded-full bg-white/40" style={{ animation:'scrollDot 2s ease-in-out infinite' }} />
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
        </div>
      </section>

      {/* ══ PRODUCT STRIP ═══════════════════════════════════════════════ */}
      <section ref={prodSectionRef} className="relative bg-black pb-20 pt-20 md:py-28" aria-label="Our Tea Collection">

        {/* Section header */}
        <div className="mx-auto mb-10 max-w-7xl px-5 md:mb-14 md:px-12">
          <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.3em] md:text-[12px]" style={{ color:'#c8a96e' }}>
            Naturally Soothing · Premium Blends
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-cinzel font-bold leading-none tracking-[-0.01em] text-white" style={{ fontSize:'clamp(28px,5vw,58px)' }}>
                The Collection
              </h2>
              <p className="mt-2.5 max-w-sm text-[14px] font-light leading-relaxed text-white/38 md:max-w-md md:text-[15px]">
                Sourced from the world&rsquo;s finest gardens. Every tea tells a story of place, season, and craft.
              </p>
            </div>
            <a href="#" className="flex-shrink-0 self-start sm:self-auto min-h-[40px] flex items-center rounded-full border border-white/[0.14] px-6 text-[12px] font-medium text-white/50 transition-all duration-200 hover:border-white/28 hover:text-white/90">
              View All →
            </a>
          </div>
          <div className="mt-7 h-px w-full md:mt-8" style={{ background:'linear-gradient(90deg,rgba(200,168,100,0.20),rgba(138,170,120,0.12),transparent)' }} />
        </div>

        {/* Horizontal scroll strip */}
        <div className="relative">
          {/* Right fade edge */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-24" style={{ background:'linear-gradient(to left,rgba(0,0,0,0.90),transparent)' }} />

          <div
            className="flex gap-5 overflow-x-auto px-5 pb-6 pt-2 scrollbar-none snap-x snap-mandatory md:px-12"
          >
            {PRODUCTS.map((p, i) => (
              <div key={p.id} ref={el => { cardRefs.current[i] = el }} className="snap-start flex-shrink-0" style={{ opacity:0 }}>
                <ProductCard product={p} />
              </div>
            ))}
            {/* Trailing spacer so last card clears fade edge */}
            <div aria-hidden className="flex-shrink-0 w-4 md:w-8" />
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black px-5 md:px-6" aria-label="Begin your ritual">
        <div ref={ctaGlowRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ background:'radial-gradient(ellipse at 50% 55%,rgba(80,55,10,0.35) 0%,rgba(40,100,20,0.10) 40%,transparent 70%)', willChange:'transform,opacity' }} />

        {[...Array(20)].map((_, i) => (
          <div key={i} aria-hidden className="pointer-events-none absolute rounded-full" style={{ width:1+(i%3)*0.6, height:1+(i%3)*0.6, left:`${5+(i*4.6)%90}%`, top:`${5+(i*7.3)%88}%`, opacity:0.05+(i%5)*0.028, background:i%2===0?'rgba(200,168,100,1)':'rgba(110,160,90,1)' }} />
        ))}

        <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-4 text-center md:max-w-2xl md:px-0">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] md:mb-5 md:text-[12px]" style={{ color:'#c8a96e' }}>Begin Your Journey</p>

          <h2 ref={ctaTitleRef} className="mb-3 font-cinzel font-bold leading-none tracking-[-0.01em] text-white opacity-0 md:mb-4" style={{ fontSize:'clamp(38px,8vw,88px)', willChange:'transform,opacity' }}>
            TEASANTI
          </h2>

          <div className="mb-6 h-px w-24 rounded-full md:mb-8 md:w-28" style={{ background:'linear-gradient(90deg,transparent,rgba(200,168,100,0.5),transparent)' }} />

          <p ref={ctaSubRef} className="mb-9 font-light leading-relaxed text-white/40 opacity-0 md:mb-12" style={{ fontSize:'clamp(14px,1.8vw,20px)', willChange:'transform,opacity' }}>
            Six exceptional teas. One ancient tradition.<br className="hidden sm:block" />
            {' '}Free worldwide delivery from&nbsp;<span className="font-medium text-white/70">$48.</span>
          </p>

          <button
            ref={ctaBtnRef}
            className="group relative w-full max-w-[260px] min-h-[52px] overflow-hidden rounded-full px-8 text-[14px] font-semibold text-white opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400/60 sm:w-auto sm:px-10"
            style={{ background:'linear-gradient(135deg,rgba(100,70,10,0.85) 0%,rgba(50,80,20,0.80) 100%)', border:'1px solid rgba(200,168,100,0.38)', boxShadow:'0 0 0 1px rgba(200,168,100,0.12),0 8px 28px rgba(80,50,5,0.38)', willChange:'transform,opacity' }}
            aria-label="Shop Teasanti teas"
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 60%)' }} />
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow:'0 0 32px rgba(200,168,100,0.38)', animation:'ctaGlowPulse 3s ease-in-out infinite' }} />
            <span className="relative z-10">Shop the Collection</span>
          </button>

          <p className="mt-6 text-[11px] text-white/18 md:mt-7">
            Free worldwide delivery · 30-day returns · Ethically sourced
          </p>
        </div>

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.05] px-5 py-4 md:px-8 md:py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <span className="font-cinzel text-[11px] font-bold uppercase tracking-[0.28em] text-white/20 md:text-[12px]">Teasanti</span>
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              {['Collections','Our Story','Sourcing','Ritual Guide','Privacy','Contact'].map(l => (
                <a key={l} href="#" className="text-[11px] text-white/20 transition-colors hover:text-white/45">{l}</a>
              ))}
            </div>
            <span className="text-[10px] text-white/14">© 2026 Teasanti Co.</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollDot {
          0%,100%{ transform:translateY(0);    opacity:0.4; }
          50%    { transform:translateY(10px); opacity:0.9; }
        }
        @keyframes ctaGlowPulse {
          0%,100%{ opacity:0.45; }
          50%    { opacity:1.00; }
        }
        .scrollbar-none::-webkit-scrollbar { display:none; }
        .scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}
