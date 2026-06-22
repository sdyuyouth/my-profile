"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useMotion"

type Props = {
  duration?: number
  delay?: number
  blur?: string
  yOffset?: number
  className?: string
  children: React.ReactNode
  onComplete?: () => void
}

export function BlurReveal({
  duration = 1,
  delay = 0.08,
  blur = "10px",
  yOffset = 20,
  className = "",
  children,
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (!rootRef.current) return

      const items = rootRef.current.querySelectorAll(".blur-reveal__item")
      if (items.length === 0) return

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0, filter: "blur(0px)" })
        onComplete?.()
        return
      }

      gsap.set(items, { opacity: 0, y: yOffset, filter: `blur(${blur})` })

      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        stagger: delay,
        ease: "power3.out",
        onComplete,
      })
    },
    { scope: rootRef, dependencies: [reduced, duration, delay, blur, yOffset] },
  )

  return (
    <div ref={rootRef} className={`blur-reveal ${className}`.trim()}>
      {children}
    </div>
  )
}
