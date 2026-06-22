"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { marqueeTools, profile, site } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.from([".hero__title", ".hero__subtitle"], {
        opacity: 0,
        y: 20,
        filter: "blur(10px)",
        duration: 1.25,
        ease: "power3.out",
      })
        .from(
          ".hero__marquee-wrap",
          { y: 18, opacity: 0, duration: 0.65 },
          "-=0.4",
        )
        .from(
          ".hero__profile",
          { y: 18, opacity: 0, duration: 0.65 },
          "-=0.45",
        )
    },
    { scope: rootRef, dependencies: [reduced] },
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
