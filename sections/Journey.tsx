"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { experience } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

export function Journey() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced || !ref.current) return
      gsap.from(".timeline-item", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      })
    },
    { scope: ref, dependencies: [reduced] },
  )

  return (
    <section id="journey" ref={ref} className="journey">
      <div className="journey__inner">
        <h2 className="journey__title">个人经历</h2>

        <div className="timeline">
          {experience.map((exp) => {
            const periodLabel = `${exp.start} — ${exp.end}`

            return (
              <article key={exp.id} className="timeline-item">
                <div className="timeline-item__rail">
                  <time className="timeline-item__date" dateTime={exp.start}>
                    {periodLabel}
                  </time>
                  <span className="timeline-item__node" aria-hidden="true" />
                </div>

                <div className="timeline-item__card">
                  <header className="timeline-item__head">
                    <h3>{exp.role}</h3>
                    <span>{exp.company}</span>
                  </header>

                  <p className="timeline-item__summary">{exp.summary}</p>

                  <ul className="timeline-item__list">
                    {exp.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>

                  {exp.stack && exp.stack.length > 0 && (
                    <div className="timeline-item__stack">
                      {exp.stack.map((tag) => (
                        <span key={tag} className="timeline-item__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {exp.links && exp.links.length > 0 && (
                    <div className="timeline-item__pills">
                      {exp.links.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
