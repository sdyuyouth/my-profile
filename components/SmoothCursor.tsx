"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/useMotion"

export type SpringConfig = {
  stiffness: number
  damping: number
  mass: number
}

// slightly under-damped → the cursor lags then springs in to catch up
const DEFAULT_SPRING: SpringConfig = {
  stiffness: 340,
  damping: 30,
  mass: 1,
}

/** Default arrow cursor — points "up", rotated toward the movement direction. */
function DefaultCursor() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 1 L23 27 L12 20.4 L1 27 Z" fill="currentColor" />
    </svg>
  )
}

type Props = {
  /** Custom cursor visual; falls back to the default arrow. */
  cursor?: ReactNode
  springConfig?: SpringConfig
}

export function SmoothCursor({ cursor, springConfig = DEFAULT_SPRING }: Props) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    // pointer-driven only — skip touch / coarse pointers entirely
    if (!window.matchMedia("(pointer: fine)").matches) return

    const el = wrapRef.current
    if (!el) return

    const { stiffness, damping, mass } = springConfig
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    const vel = { x: 0, y: 0 }
    let angle = 0
    let scale = 1
    let moved = false
    let raf = 0
    let last = performance.now()

    // show the custom cursor (and hide the native one) only while the page is
    // focused AND the pointer is inside it — otherwise restore the native cursor
    // so dialogs, tab switches, devtools, etc. never leave the page cursor-less
    let inside = true
    let focused = document.hasFocus()

    const sync = () => {
      const on = moved && inside && focused
      el.classList.toggle("smooth-cursor--on", on)
      document.documentElement.classList.toggle("smooth-cursor-active", on)
    }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!moved) {
        // snap to the first position so it doesn't lurch in from screen centre
        moved = true
        pos.x = target.x
        pos.y = target.y
        vel.x = vel.y = 0
        last = performance.now()
      }
      inside = true
      sync()
    }

    const onLeave = () => {
      inside = false
      sync()
    }
    const onEnter = () => {
      inside = true
      sync()
    }
    const onBlur = () => {
      focused = false
      sync()
    }
    const onFocus = () => {
      focused = true
      sync()
    }
    const onVisibility = () => {
      focused = document.visibilityState === "visible" && document.hasFocus()
      sync()
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      // semi-implicit Euler spring, per axis
      vel.x += ((-stiffness * (pos.x - target.x) - damping * vel.x) / mass) * dt
      vel.y += ((-stiffness * (pos.y - target.y) - damping * vel.y) / mass) * dt
      pos.x += vel.x * dt
      pos.y += vel.y * dt

      const speed = Math.hypot(vel.x, vel.y)
      if (speed > 30) {
        const aim = (Math.atan2(vel.y, vel.x) * 180) / Math.PI + 90
        let da = ((aim - angle) % 360)
        da = ((da + 540) % 360) - 180 // shortest rotation
        angle += da * Math.min(1, dt * 12)
      }
      const targetScale = 1 + Math.min(speed / 3200, 0.35)
      scale += (targetScale - scale) * Math.min(1, dt * 10)

      el.style.transform =
        `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)` +
        ` translate(-50%, -50%) rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    window.addEventListener("blur", onBlur)
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibility)
      el.classList.remove("smooth-cursor--on")
      document.documentElement.classList.remove("smooth-cursor-active")
    }
  }, [reduced, springConfig])

  if (reduced) return null

  return (
    <div ref={wrapRef} className="smooth-cursor" aria-hidden="true">
      {cursor ?? <DefaultCursor />}
    </div>
  )
}
