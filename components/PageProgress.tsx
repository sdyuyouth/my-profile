"use client"

import { useEffect } from "react"

/** 纯 CSS 变量更新，不走 GSAP */
export function PageProgress() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".page-progress")
    if (!bar) return

    let ticking = false
    const update = () => {
      ticking = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.setProperty("--progress", max > 0 ? String(window.scrollY / max) : "0")
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
    }
  }, [])

  return <div className="page-progress" aria-hidden />
}
