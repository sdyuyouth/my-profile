"use client"

import { useEffect } from "react"
import { ScrollTrigger } from "@/lib/gsap"
import { useReducedMotion } from "@/hooks/useMotion"

/** 原生滚动 + ScrollTrigger，避免 Lenis 常驻 RAF 循环 */
export function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const onScroll = () => ScrollTrigger.update()
    window.addEventListener("scroll", onScroll, { passive: true })
    ScrollTrigger.refresh()
    return () => window.removeEventListener("scroll", onScroll)
  }, [reduced])

  return <>{children}</>
}
