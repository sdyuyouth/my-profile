"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import type { Project } from "@/data/site"
import { projects, statusLabels } from "@/data/site"
import { TechLanes } from "@/components/TechLanes"
import { StackFlow } from "@/components/StackFlow"
import { useIsMobile, useReducedMotion } from "@/hooks/useMotion"

const STAGGER_SELECTOR =
  ".work-detail__head, .work-detail__highlight, .work-detail__para, .tech-lanes__col"

function resetSlide(slide: HTMLElement) {
  gsap.killTweensOf(slide)
  gsap.set(slide, {
    autoAlpha: 0,
    zIndex: 1,
    clearProps: "transform,filter,clipPath",
  })
  const inner = slide.querySelector(".work-detail")
  if (inner) gsap.killTweensOf(inner.querySelectorAll(STAGGER_SELECTOR))
}

export function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const displayedRef = useRef(0)
  const scrollLockRef = useRef(false)
  const tweenRef = useRef<gsap.core.Timeline | null>(null)
  const switchingRef = useRef(false)
  const runSwitchRef = useRef<(next: number, stagger?: boolean) => void>(() => {})
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const mobile = useIsMobile(800)
  const pinned = !reduced && !mobile
  // The pin ScrollTrigger is created only AFTER mount. On a phone the very first
  // (SSR-matching) render assumes desktop, so without this gate a pin would be
  // built and then torn down when `mobile` resolves — and GSAP leaves its
  // pin-spacer behind, opening a tall blank gap under the mobile carousel.
  const [pinReady, setPinReady] = useState(false)
  useEffect(() => setPinReady(true), [])

  // On mobile the Work section's height changes a lot (pinned grid → carousel,
  // plus any stray pin-spacer removed). Both must happen BEFORE we recompute
  // ScrollTrigger, otherwise sections below (Journey/Method) cache stale scroll
  // positions and never reveal. Runs as a plain effect (after useGSAP's
  // layout-effect cleanup) and refreshes on the next frame once layout settles.
  useEffect(() => {
    if (!mobile) return
    const pin = pinRef.current
    const spacer = pin?.parentElement
    if (pin && spacer?.classList.contains("pin-spacer")) {
      spacer.replaceWith(pin)
      pin.removeAttribute("style")
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [mobile])

  const project = projects[active] ?? projects[0]

  const runSwitch = useCallback(
    (next: number, stagger = false) => {
      if (!cardRef.current || !pinned) return

      const slides = gsap.utils.toArray<HTMLElement>(".work__slide", cardRef.current)
      if (slides.length === 0) return

      const prev = displayedRef.current
      if (prev === next) return

      tweenRef.current?.kill()
      slides.forEach((slide) => {
        gsap.killTweensOf(slide)
        const inner = slide.querySelector(".work-detail")
        if (inner) gsap.killTweensOf(inner.querySelectorAll(STAGGER_SELECTOR))
      })

      slides.forEach((slide, i) => {
        if (i !== prev && i !== next) resetSlide(slide)
      })

      const outEl = slides[prev]
      const inEl = slides[next]
      if (!outEl || !inEl) return

      switchingRef.current = true
      displayedRef.current = next
      setActive(next)

      const dir = next > prev ? 1 : -1
      const inner = inEl.querySelector(".work-detail")
      const staggerTargets = inner
        ? inner.querySelectorAll<HTMLElement>(STAGGER_SELECTOR)
        : []

      gsap.set(inEl, { autoAlpha: 1, zIndex: 3 })
      gsap.set(outEl, { autoAlpha: 1, zIndex: 2 })

      if (stagger && staggerTargets.length) {
        gsap.set(staggerTargets, { opacity: 0, y: 16 })
      }

      const finish = () => {
        switchingRef.current = false
        resetSlide(outEl)
        gsap.set(inEl, { zIndex: 2, clearProps: "transform,filter,clipPath" })
        if (staggerTargets.length) {
          gsap.set(staggerTargets, { clearProps: "opacity,transform" })
        }
      }

      const tl = gsap.timeline({ onComplete: finish, onInterrupt: finish })

      tl.to(
        outEl,
        {
          y: dir * -32,
          scale: 0.97,
          rotateX: dir * 5,
          filter: "blur(10px)",
          autoAlpha: 0,
          duration: 0.48,
          ease: "power3.in",
          transformOrigin: "50% 50%",
        },
        0,
      )

      tl.fromTo(
        inEl,
        {
          y: dir * 56,
          scale: 0.94,
          rotateX: dir * -8,
          clipPath: "inset(100% 0 0 0)",
          filter: "blur(12px)",
          autoAlpha: 0,
        },
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          clipPath: "inset(0% 0 0 0)",
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 0.78,
          ease: "power4.out",
          transformOrigin: "50% 100%",
        },
        0.06,
      )

      if (stagger && staggerTargets.length) {
        tl.to(
          staggerTargets,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.28,
        )
      }

      tweenRef.current = tl
    },
    [pinned],
  )

  runSwitchRef.current = runSwitch

  useGSAP(
    () => {
      if (!cardRef.current || !pinned) return

      const slides = gsap.utils.toArray<HTMLElement>(".work__slide", cardRef.current)
      slides.forEach((slide, i) => {
        if (i === 0) {
          gsap.set(slide, { autoAlpha: 1, zIndex: 2, clearProps: "transform,filter,clipPath" })
        } else {
          resetSlide(slide)
        }
      })
      displayedRef.current = 0
    },
    { scope: cardRef, dependencies: [pinned] },
  )

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || !pinned || !pinReady) {
        stRef.current = null
        return
      }

      const count = projects.length
      const step = 0.42
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * step * Math.max(count - 1, 0)}`,
        pin: pinRef.current,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (count <= 1 || scrollLockRef.current) return
          const idx = Math.min(count - 1, Math.floor(self.progress * count))
          if (idx === displayedRef.current) return
          runSwitchRef.current(idx, !switchingRef.current)
        },
      })

      stRef.current = st
      return () => {
        // kill(true) reverts the pin (removes the pin-spacer) on the desktop→
        // mobile resize path. The phone-load path is handled by `pinReady`,
        // which keeps this trigger from ever being created on a phone.
        st.kill(true)
        stRef.current = null
      }
    },
    { scope: sectionRef, dependencies: [pinned, pinReady] },
  )

  const goToProject = useCallback(
    (index: number) => {
      if (!pinned) {
        setActive(index)
        displayedRef.current = index
        return
      }

      const st = stRef.current
      const count = projects.length

      scrollLockRef.current = true
      runSwitch(index, true)

      if (st && count > 1) {
        const progress = (index + 0.01) / count
        const top = st.start + (st.end - st.start) * progress
        window.scrollTo({ top, behavior: "smooth" })
      }

      window.setTimeout(() => {
        scrollLockRef.current = false
      }, 900)
    },
    [pinned, runSwitch],
  )

  return (
    <section id="work" ref={sectionRef} className="work">
      <div ref={pinRef} className="work__pin">
        <div className="work__inner">
          {mobile ? (
            <WorkMobileCarousel />
          ) : (
          <div className="work__grid">
            <aside className="work__sidebar">
              <h2 className="work__heading">我都做过什么项目</h2>
              {pinned && <p className="work__hint">滚动切换 · 点击跳转</p>}
              <nav className="work__tabs" role="tablist" aria-label="项目列表">
                {projects.map((p, i) => (
                  <ProjectTab
                    key={p.id}
                    project={p}
                    index={i}
                    active={active === i}
                    onSelect={() => goToProject(i)}
                  />
                ))}
              </nav>
            </aside>

            <div className="work__panel">
              <div ref={cardRef} className="work__card">
                {pinned ? (
                  projects.map((p, i) => (
                    <div
                      key={p.id}
                      className={`work__slide${active === i ? " work__slide--on" : ""}`}
                      role="tabpanel"
                      aria-labelledby={`tab-${p.id}`}
                      aria-hidden={active !== i}
                    >
                      <ProjectDetail project={p} compact animate={false} />
                    </div>
                  ))
                ) : (
                  <div role="tabpanel" aria-labelledby={`tab-${project.id}`}>
                    <ProjectDetail project={project} key={project.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Phones get a horizontal swipe carousel — one project per screen, swipe
 * left/right to switch, each card scrolls vertically for its own long content.
 * Replaces both the pinned scroll-hijack and the horizontal tab strip, which
 * both read as broken on touch. Native scroll-snap drives the paging; an rAF
 * scroll handler tracks the centred slide for the counter + dots.
 */
function WorkMobileCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)

  const slidesOf = (track: HTMLElement) =>
    Array.from(track.querySelectorAll<HTMLElement>(".work__swipe-slide"))

  const onScroll = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const track = trackRef.current
      if (!track) return
      const center = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      slidesOf(track).forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    })
  }

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = slidesOf(track)[i]
    if (!slide) return
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    })
  }

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  // When the finger moves mostly vertically, release the horizontal track so the
  // page can scroll down to Journey. Without this, overflow-x:auto on the track
  // captures every touch that starts on a card.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let startX = 0
    let startY = 0
    let axis: "x" | "y" | null = null

    const reset = () => {
      axis = null
      track.style.overflowX = ""
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      axis = null
      track.style.overflowX = ""
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY

      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      }

      if (axis === "y") {
        track.style.overflowX = "hidden"
      }
    }

    track.addEventListener("touchstart", onTouchStart, { passive: true })
    track.addEventListener("touchmove", onTouchMove, { passive: true })
    track.addEventListener("touchend", reset, { passive: true })
    track.addEventListener("touchcancel", reset, { passive: true })

    return () => {
      track.removeEventListener("touchstart", onTouchStart)
      track.removeEventListener("touchmove", onTouchMove)
      track.removeEventListener("touchend", reset)
      track.removeEventListener("touchcancel", reset)
      track.style.overflowX = ""
    }
  }, [])

  return (
    <div className="work__swipe">
      <header className="work__swipe-head">
        <h2 className="work__heading">我都做过什么项目</h2>
        <p className="work__swipe-hint">
          <span className="work__swipe-count">
            {String(active + 1).padStart(2, "0")}
            <span className="work__swipe-count-sep"> / </span>
            {String(projects.length).padStart(2, "0")}
          </span>
          <span className="work__swipe-hint-text">左右滑动切换项目</span>
        </p>
      </header>

      <div
        ref={trackRef}
        className="work__swipe-track"
        onScroll={onScroll}
        role="group"
        aria-label="项目列表"
      >
        {projects.map((p, i) => (
          <article
            key={p.id}
            className="work__swipe-slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${projects.length}`}
          >
            <WorkMobileCard project={p} index={i} />
          </article>
        ))}
      </div>

      <div className="work__dots" role="group" aria-label="项目导航">
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`work__dot${active === i ? " work__dot--on" : ""}`}
            aria-label={`查看第 ${i + 1} 个项目：${p.title}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}

const WM_FACETS = [
  { id: "overview", label: "概览" },
  { id: "features", label: "功能" },
  { id: "tech", label: "技术" },
  { id: "details", label: "详情" },
] as const

type WmFacet = (typeof WM_FACETS)[number]["id"]

/**
 * A single project card for the phone carousel. The header (number / status /
 * title) and a segmented control stay fixed; the four facets — overview,
 * features, tech, details — swap inside a fixed-height panel, so the card's
 * height never changes as the reader taps between them.
 */
function WorkMobileCard({ project, index }: { project: Project; index: number }) {
  const [facet, setFacet] = useState<WmFacet>("overview")
  const linkable = project.status === "open" && (project.demo || project.repo)

  return (
    <div className="work__swipe-card">
      <div className="wm-card__top">
        <span className="wm-card__index">{String(index + 1).padStart(2, "0")}</span>
        <span className={`wm-card__status wm-card__status--${project.status}`}>
          {statusLabels[project.status]}
        </span>
      </div>

      <p className="wm-card__cat">{project.category}</p>
      <h3 className="wm-card__title">{project.title}</h3>

      <div className="wm-seg" role="tablist" aria-label="项目信息">
        {WM_FACETS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={facet === f.id}
            className={`wm-seg__btn${facet === f.id ? " wm-seg__btn--on" : ""}`}
            onClick={() => setFacet(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="wm-panel" role="tabpanel">
        <div key={facet} className="wm-panel__inner">
          {facet === "overview" && (
            <>
              <p className="wm-panel__summary">{project.summary}</p>
              <ul className="wm-panel__points">
                {project.features.map((f) => (
                  <li key={f.title}>{f.title}</li>
                ))}
              </ul>
              {linkable && (
                <div className="wm-card__actions">
                  {project.demo && (
                    <a
                      className="wm-card__btn"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live ↗
                    </a>
                  )}
                  {project.repo && (
                    <a
                      className="wm-card__btn wm-card__btn--ghost"
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repo ↗
                    </a>
                  )}
                </div>
              )}
            </>
          )}

          {facet === "features" && (
            <ul className="wm-panel__features">
              {project.features.map((f) => (
                <li key={f.title}>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </li>
              ))}
            </ul>
          )}

          {facet === "tech" && (
            <ul className="wm-panel__tech">
              {project.stackLayers.map((layer) => (
                <li key={layer.layer} className="wm-panel__lane">
                  <span className="wm-panel__lane-name">{layer.layer}</span>
                  <div className="wm-panel__lane-items">
                    {layer.items.map((it) => (
                      <span key={it} className="wm-panel__chip">
                        {it}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {facet === "details" && (
            <ul className="wm-panel__details">
              {project.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectTab({
  project,
  index,
  active,
  onSelect,
}: {
  project: Project
  index: number
  active: boolean
  onSelect: () => void
}) {
  const status = statusLabels[project.status]

  return (
    <button
      id={`tab-${project.id}`}
      type="button"
      role="tab"
      aria-selected={active}
      className={`work-tab${active ? " work-tab--on" : ""}`}
      onClick={onSelect}
    >
      <span className="work-tab__num">{String(index + 1).padStart(2, "0")}</span>
      <span className="work-tab__body">
        <span className="work-tab__title">{project.title}</span>
        <span className="work-tab__meta">
          {status && (
            <span className={`work-tab__status work-tab__status--${project.status}`}>
              {status}
            </span>
          )}
          {project.status === "open" && (
            <span className="work-tab__links">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live ↗
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Repo ↗
                </a>
              )}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}

function ProjectDetail({
  project,
  compact = false,
  animate = true,
}: {
  project: Project
  compact?: boolean
  animate?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!animate || !ref.current) return
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
      )
    },
    { scope: ref, dependencies: [project.id, animate] },
  )

  return (
    <article ref={ref} className={`work-detail${compact ? " work-detail--compact" : ""}`}>
      <header className="work-detail__head">
        <div className="work-detail__head-row">
          <div className="work-detail__head-main">
            <p className="work-detail__cat">{project.category}</p>
            <h3 className="work-detail__title">{project.title}</h3>
          </div>
          {project.status === "open" && (project.demo || project.repo) && (
            <div className="work-detail__actions">
              {project.demo && (
                <a
                  className="work-detail__btn"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live ↗
                </a>
              )}
              {project.repo && (
                <a
                  className="work-detail__btn work-detail__btn--ghost"
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repo ↗
                </a>
              )}
            </div>
          )}
        </div>
        <p className="work-detail__summary">{project.summary}</p>
      </header>

      <ul className="work-detail__highlights">
        {project.features.map((f) => (
          <li key={f.title} className="work-detail__highlight">
            <strong>{f.title}</strong>
            <span>{f.desc}</span>
          </li>
        ))}
      </ul>

      <div className="work-detail__details">
        {project.details.map((p) => (
          <p key={p} className="work-detail__para">
            {p}
          </p>
        ))}
      </div>

      <div className="work-detail__stack">
        {compact ? (
          <TechLanes layers={project.stackLayers} projectId={project.id} />
        ) : (
          <>
            <h4 className="work-detail__label">技术栈</h4>
            <StackFlow layers={project.stackLayers} projectId={project.id} layout="horizontal" />
          </>
        )}
      </div>
    </article>
  )
}
