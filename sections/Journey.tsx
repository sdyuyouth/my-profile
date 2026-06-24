"use client"

import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { experience } from "@/data/site"
import { useIsMobile, useReducedMotion } from "@/hooks/useMotion"

export function Journey() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile(800)
  // Defer setup until after mount so `mobile` is already resolved. Otherwise the
  // desktop-assumed first render builds the scrubbed ScrollTriggers, and on a
  // phone they aren't fully reverted — they keep overriding the cards' opacity,
  // so the cards never appear. Gating here means they're only ever built once
  // we know which path (mobile IO vs desktop scrub) to take.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  useGSAP(
    () => {
      const root = ref.current
      if (!root || !ready) return

      const timeline = root.querySelector<HTMLElement>(".timeline")
      const axis = root.querySelector<HTMLElement>(".timeline__axis")
      const fill = root.querySelector<HTMLElement>(".timeline__axis-fill")
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item", root)
      const nodes = gsap.utils.toArray<HTMLElement>(".timeline-item__node", root)
      if (!timeline || !axis || nodes.length === 0) return

      // Span the axis precisely from the first node center to the last.
      const positionAxis = () => {
        const tlTop = timeline.getBoundingClientRect().top
        const first = nodes[0].getBoundingClientRect()
        const last = nodes[nodes.length - 1].getBoundingClientRect()
        const top = first.top + first.height / 2 - tlTop
        const bottom = last.top + last.height / 2 - tlTop
        axis.style.top = `${top}px`
        axis.style.height = `${bottom - top}px`
      }

      if (reduced) {
        positionAxis()
        if (fill) gsap.set(fill, { height: "100%" })
        items.forEach((item) => item.classList.add("is-active"))
        return
      }

      positionAxis()
      ScrollTrigger.addEventListener("refresh", positionAxis)

      if (mobile) {
        // On mobile the Work section above relayouts on the flip, leaving
        // ScrollTrigger positions stale; and useGSAP's revert eats async tweens.
        // So drive reveals with CSS classes toggled by an IntersectionObserver —
        // classes survive every revert and IO is immune to layout shifts. The
        // axis is just drawn statically.
        //
        // First, hard-kill any scrubbed triggers a desktop-assumed first render
        // created in this section (kill(true) clears the inline opacity:0 they
        // leave on the cards, which would otherwise win over the CSS classes).
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && root.contains(st.trigger)) st.kill(true)
        })

        if (fill) gsap.set(fill, { height: "100%" })
        const cards = items
          .map((item) => item.querySelector<HTMLElement>(".timeline-item__card"))
          .filter((c): c is HTMLElement => c !== null)
        cards.forEach((card) => {
          gsap.set(card, { clearProps: "all" }) // drop any leftover inline gsap styles
          card.classList.add("tl-reveal")
        })

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add("tl-reveal--in")
              entry.target.closest(".timeline-item")?.classList.add("is-active")
              io.unobserve(entry.target)
            })
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        )
        cards.forEach((card) => io.observe(card))

        return () => {
          ScrollTrigger.removeEventListener("refresh", positionAxis)
          io.disconnect()
        }
      }

      // The axis "draws" itself — starts the moment the section enters and
      // completes by the time its center hits mid-viewport (fast, satisfying).
      if (fill) {
        gsap.fromTo(
          fill,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 88%",
              end: "center 50%",
              scrub: 0.4,
            },
          },
        )
      }

      // Scroll-bound focus: each card eases into focus (blur+rise+scale → sharp),
      // then gently recedes as the next one takes over — a relay of attention.
      items.forEach((item) => {
        const card = item.querySelector<HTMLElement>(".timeline-item__card")
        const node = item.querySelector(".timeline-item__node")

        if (card) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                end: "bottom 40%",
                scrub: 0.6,
              },
            })
            .fromTo(
              card,
              { autoAlpha: 0, y: 52, scale: 0.95, filter: "blur(7px)" },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                ease: "power2.out",
                duration: 0.55,
              },
            )
            .to(
              card,
              {
                autoAlpha: 0.6,
                scale: 0.985,
                filter: "blur(0px)",
                ease: "power1.in",
                duration: 0.45,
              },
              ">0.12",
            )
        }

        if (node) {
          ScrollTrigger.create({
            trigger: node,
            start: "center 58%",
            onEnter: () => item.classList.add("is-active"),
            onLeaveBack: () => item.classList.remove("is-active"),
          })
        }

        // Only the card crossing the focus band glows — focus relays card to card.
        if (card) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 68%",
            end: "bottom 46%",
            toggleClass: { targets: card, className: "is-focus" },
          })
        }
      })

      return () => {
        ScrollTrigger.removeEventListener("refresh", positionAxis)
      }
    },
    { scope: ref, dependencies: [reduced, mobile, ready] },
  )

  // Spotlight follows the cursor: feed pointer position into CSS vars.
  const handleCardPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
    el.style.setProperty("--my", `${e.clientY - rect.top}px`)
  }

  return (
    <section id="journey" ref={ref} className="journey">
      <div className="journey__inner">
        <header className="journey__header">
          <p className="journey__eyebrow">Experience</p>
          <h2 className="journey__title">个人经历</h2>
        </header>

        <div className="timeline">
          <div className="timeline__axis" aria-hidden="true">
            <div className="timeline__axis-fill" />
          </div>

          {experience.map((exp, i) => {
            const ongoing = exp.end === "至今"
            const index = String(i + 1).padStart(2, "0")

            return (
              <article
                key={exp.id}
                className={`timeline-item${ongoing ? " timeline-item--current" : ""}`}
              >
                <div className="timeline-item__rail" aria-hidden="true">
                  <span className="timeline-item__node" />
                </div>

                <div
                  className="timeline-item__card"
                  data-index={index}
                  onPointerMove={handleCardPointer}
                >
                  <div className="timeline-item__meta">
                    <time className="timeline-item__date" dateTime={exp.start}>
                      {exp.start}
                      <span className="timeline-item__date-sep">—</span>
                      {exp.end}
                    </time>
                    {ongoing && <span className="timeline-item__badge">进行中</span>}
                  </div>

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
