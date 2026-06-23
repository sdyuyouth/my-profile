"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { subscribeToasts, type ToastData } from "@/lib/notify"
import { useReducedMotion } from "@/hooks/useMotion"

const HOLD_S = 2.1 // dwell time; with the ~0.9s in/out animations ≈ 3s total
const MAX = 4 // cap the visible stack

/**
 * Animated-list notification stack (ported from Magic UI / Inspira's Vue
 * "Animated List"). Each item springs in, holds, then animates out and removes
 * itself — newest sits at the bottom-right corner, older ones stack upward.
 */
export function Notifications() {
  const [items, setItems] = useState<ToastData[]>([])
  const reduced = useReducedMotion()

  useEffect(
    () =>
      subscribeToasts((toast) => {
        setItems((prev) => [...prev, toast].slice(-MAX))
      }),
    [],
  )

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  if (items.length === 0) return null

  return (
    <div className="toasts" aria-live="polite" role="status">
      {items.map((toast) => (
        <Notification key={toast.id} data={toast} reduced={reduced} onDone={remove} />
      ))}
    </div>
  )
}

function Notification({
  data,
  reduced,
  onDone,
}: {
  data: ToastData
  reduced: boolean
  onDone: (id: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const done = () => onDone(data.id)

      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 })
        const t = window.setTimeout(done, HOLD_S * 1000)
        return () => window.clearTimeout(t)
      }

      const tl = gsap
        .timeline()
        .from(el, {
          opacity: 0,
          y: -24,
          scale: 0.9,
          filter: "blur(5px)",
          duration: 0.5,
          ease: "power3.out",
        })
        .to(el, { duration: HOLD_S })
        .to(el, {
          opacity: 0,
          scale: 0.96,
          y: -12,
          filter: "blur(4px)",
          duration: 0.4,
          ease: "power2.in",
          onComplete: done,
        })

      return () => tl.kill()
    },
    { scope: ref, dependencies: [] },
  )

  return (
    <div ref={ref} className={`toast toast--${data.tone ?? "ok"}`}>
      <span className="toast__icon" aria-hidden="true">
        {data.tone === "error" ? (
          "!"
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </span>
      <span className="toast__body">
        <span className="toast__title">{data.title}</span>
        {data.detail && <span className="toast__detail">{data.detail}</span>}
      </span>
    </div>
  )
}
