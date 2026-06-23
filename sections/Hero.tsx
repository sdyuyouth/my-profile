"use client"

import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { CopyButton } from "@/components/CopyButton"
import { marqueeTools, profile, site } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

const HERO_TITLES = site.hero.titles
const HOLD_S = 3 // pause on each slogan
const TYPE_PER_CHAR = 0.05 // base seconds/char, shaped by the ease curve
const ERASE_PER_CHAR = 0.03

const HERO_VISIBLE = {
  title: { opacity: 1, y: 0, filter: "blur(0px)" },
  fade: { opacity: 1, y: 0 },
} as const

let heroIntroPlayed = false

function markHeroRevealed(scope: HTMLElement) {
  scope.classList.add("hero--revealed")
}

function revealHero(scope: HTMLElement) {
  markHeroRevealed(scope)
  gsap.set(scope.querySelectorAll(".hero__title, .hero__subtitle"), {
    clearProps: "opacity,transform,filter,willChange",
  })
  gsap.set(scope.querySelectorAll(".hero__marquee-wrap, .hero__profile"), {
    clearProps: "opacity,transform,willChange",
  })
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [title, setTitle] = useState<string>(HERO_TITLES[0])
  const [ghostChar, setGhostChar] = useState("")
  const [ghostOpacity, setGhostOpacity] = useState(0)
  const [typing, setTyping] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  useGSAP(
    () => {
      const scope = rootRef.current
      if (!scope) return

      if (reduced || heroIntroPlayed) {
        revealHero(scope)
        setIntroDone(true)
        return
      }

      heroIntroPlayed = true
      // start the rotation clock now so the first 3s hold overlaps the intro
      // entrance (reveal still happens on complete, before the first erase)
      setIntroDone(true)

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => revealHero(scope),
      })

      tl.to(scope.querySelectorAll(".hero__title, .hero__subtitle"), {
        ...HERO_VISIBLE.title,
        duration: 1.25,
      })
        .to(
          scope.querySelector(".hero__marquee-wrap"),
          { ...HERO_VISIBLE.fade, duration: 0.65 },
          "-=0.4",
        )
        .to(
          scope.querySelector(".hero__profile"),
          { ...HERO_VISIBLE.fade, duration: 0.65 },
          "-=0.45",
        )
    },
    { scope: rootRef, dependencies: [reduced], revertOnUpdate: false },
  )

  // Typewriter rotation. A GSAP-eased char counter (proxy.n) drives the speed
  // curve; its fractional part fades the *leading* character in/out so chars
  // flow continuously instead of snapping — no per-character stutter.
  useEffect(() => {
    if (reduced || !introDone || HERO_TITLES.length <= 1) return

    const proxy = { n: HERO_TITLES[0].length }
    const tl = gsap.timeline({ repeat: -1 })

    // settled text, leading char, and its opacity all update in one React
    // commit so the ghost→solid handoff never drops a frame.
    const paint = (target: string) => {
      const n = Math.max(0, proxy.n)
      const floor = Math.floor(n)
      setTitle(target.slice(0, floor))
      setGhostChar(target[floor] ?? "")
      setGhostOpacity(n - floor)
    }

    HERO_TITLES.forEach((current, i) => {
      const next = HERO_TITLES[(i + 1) % HERO_TITLES.length]

      tl.to({}, { duration: HOLD_S })
        .to(proxy, {
          n: 0,
          duration: Math.max(0.35, current.length * ERASE_PER_CHAR),
          ease: "power2.inOut",
          onStart: () => setTyping(true),
          onUpdate: () => paint(current),
        })
        .to(proxy, {
          n: next.length,
          duration: Math.max(0.5, next.length * TYPE_PER_CHAR),
          ease: "power2.inOut",
          onUpdate: () => paint(next),
          onComplete: () => setTyping(false),
        })
    })

    return () => {
      tl.kill()
    }
  }, [reduced, introDone])

  const profileLine = [
    `${profile.age} 岁`,
    profile.grade,
    profile.school,
    profile.major,
    profile.hometown,
    profile.politicalStatus,
  ].join(" · ")

  const toolsRow = marqueeTools.join(" · ")

  return (
    <section id="hero" ref={rootRef} className="hero">
      <div className="hero__center">
        <h1 className="hero__title" aria-label={HERO_TITLES[0]}>
          <span className="hero__title-text">{title}</span>
          <span
            className="hero__title-ghost"
            style={{ opacity: ghostOpacity }}
            aria-hidden="true"
          >
            {ghostChar}
          </span>
          <span
            className={`hero__caret${typing ? " hero__caret--typing" : ""}`}
            aria-hidden="true"
          />
        </h1>
        <p className="hero__subtitle">
          {site.hero.subtitle}
          <span className="hero__dot"> · </span>
          <span className="hero__powered">{site.hero.poweredBy}</span>
        </p>
      </div>

      <div className="hero__marquee-wrap" aria-hidden={reduced}>
        {reduced ? (
          <p className="hero__marquee-static">{toolsRow}</p>
        ) : (
          <div className="hero__marquee">
            <div className="hero__marquee-track">
              <span>{toolsRow}</span>
              <span>{toolsRow}</span>
            </div>
          </div>
        )}
      </div>

      <div className="hero__profile">
        <p className="hero__profile-meta">{profileLine}</p>
        <p className="hero__profile-contact">
          <CopyButton value={site.phone} label="手机号">
            {site.phone}
          </CopyButton>
          <span> · </span>
          <CopyButton value={site.email} label="邮箱">
            {site.email}
          </CopyButton>
          <span> · </span>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            {site.githubLabel} ↗
          </a>
        </p>
      </div>
    </section>
  )
}
