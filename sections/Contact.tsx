"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { LineShadowText } from "@/components/LineShadowText"
import { CopyButton } from "@/components/CopyButton"
import { site } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

export function Contact() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (!rootRef.current) return

      if (reduced) {
        gsap.set([".contact__slogan-wrap", ".contact__link"], { opacity: 1, y: 0 })
        return
      }

      gsap.set([".contact__slogan-wrap", ".contact__link"], { opacity: 0, y: 16 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72%",
            once: true,
          },
        })
        .to(".contact__slogan-wrap", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".contact__link",
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.35",
        )
    },
    { scope: rootRef, dependencies: [reduced] },
  )

  return (
    <footer id="contact" ref={rootRef} className="contact">
      <div className="contact__slogan-wrap">
        <LineShadowText as="h2" shadowColor="#dc5935" className="contact__slogan">
          {site.contactSlogan}
        </LineShadowText>
      </div>

      <CopyButton className="contact__link" value={site.email} label="邮箱">
        {site.email}
      </CopyButton>
    </footer>
  )
}
