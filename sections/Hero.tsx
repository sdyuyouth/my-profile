"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { marqueeTools, profile, site } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

const HERO_VISIBLE = {
  title: { opacity: 1, y: 0, filter: "blur(0px)" },
  fade: { opacity: 1, y: 0 },
} as const

let heroIntroPlayed = false

function revealHero(scope: HTMLElement) {
  gsap.set(scope.querySelectorAll(".hero__title, .hero__subtitle"), HERO_VISIBLE.title)
  gsap.set(scope.querySelectorAll(".hero__marquee-wrap, .hero__profile"), HERO_VISIBLE.fade)
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const scope = rootRef.current
      if (!scope) return

      if (reduced) {
        revealHero(scope)
        return
      }

      if (heroIntroPlayed) {
        revealHero(scope)
        return
      }

      heroIntroPlayed = true

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.set(scope.querySelectorAll(".hero__title, .hero__subtitle"), {
            clearProps: "transform,filter,willChange",
          })
          gsap.set(scope.querySelectorAll(".hero__marquee-wrap, .hero__profile"), {
            clearProps: "transform,willChange",
          })
        },
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
        <h1 className="hero__title">{site.hero.title}</h1>
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
          <a href={`tel:${site.phone}`}>{site.phone}</a>
          <span> · </span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span> · </span>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            {site.githubLabel} ↗
          </a>
        </p>
      </div>
    </section>
  )
}
