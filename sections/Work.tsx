"use client"

import { useCallback, useRef, useState } from "react"
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
      if (!sectionRef.current || !pinRef.current || !pinned) {
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
        st.kill()
        stRef.current = null
      }
    },
    { scope: sectionRef, dependencies: [pinned] },
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
        </div>
      </div>
    </section>
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
