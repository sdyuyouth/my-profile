"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { method } from "@/data/site"
import { useReducedMotion } from "@/hooks/useMotion"

const fmt = (n: number, decimals: number, suffix: string) =>
  (decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US")) + suffix

// progress colours: accent (start) → accent-2 (end), interpolated along the path
const ACCENT = "#dc5935"
const ACCENT_2 = "#d3ef76"

function lerpHex(a: string, b: string, t: number) {
  const ca = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const cb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const mix = ca.map((v, i) => Math.round(v + (cb[i] - v) * t))
  return `#${mix.map((v) => v.toString(16).padStart(2, "0")).join("")}`
}

const progressColor = (i: number, segs: number) =>
  lerpHex(ACCENT, ACCENT_2, segs <= 1 ? 0 : i / (segs - 1))

const SVG_NS = "http://www.w3.org/2000/svg"

// soft comet: many tightly-overlapping radial blobs fuse into one smooth glow
const COMET_BLOBS = 22

export function Method() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return

      const nums = gsap.utils.toArray<HTMLElement>(".method-stat__num", root)
      const decimalsOf = (el: HTMLElement) => Number(el.dataset.decimals || 0)
      const suffixOf = (el: HTMLElement) => el.dataset.suffix || ""

      // ── one continuous SVG path threaded through the actual node centres ──
      const snakeEl = root.querySelector<HTMLElement>(".method__snake")
      const svg = root.querySelector<SVGSVGElement>(".method__snake-svg")
      const baseG = root.querySelector<SVGGElement>(".method__snake-base")
      const cometG = root.querySelector<SVGGElement>(".method__snake-comet")
      const stepNodes = gsap.utils.toArray<HTMLElement>(".method-step__node", root)
      let cometTween: gsap.core.Tween | null = null

      const drawSnake = () => {
        if (!snakeEl || !svg || !baseG || !cometG || stepNodes.length < 2) return
        const box = snakeEl.getBoundingClientRect()
        if (!box.width) return
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`)

        const pts = stepNodes.map((n) => {
          const r = n.getBoundingClientRect()
          return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]
        })
        const ptStr = pts.map((p) => p.join(",")).join(" ")

        // base: straight per-segment rails, coloured by progress
        const segs = pts.length - 1
        while (baseG.firstChild) baseG.removeChild(baseG.firstChild)
        for (let i = 0; i < segs; i++) {
          const line = document.createElementNS(SVG_NS, "line")
          line.setAttribute("x1", String(pts[i][0]))
          line.setAttribute("y1", String(pts[i][1]))
          line.setAttribute("x2", String(pts[i + 1][0]))
          line.setAttribute("y2", String(pts[i + 1][1]))
          line.setAttribute("stroke", progressColor(i, segs))
          baseG.appendChild(line)
        }

        // comet: a soft radial-glow spark glides along the path. Two sparks half
        // a lap apart keep the flow unbroken; each fades at the path ends so the
        // loop seam is invisible. Radial blobs fade to transparent → no hard edge.
        cometTween?.kill()
        while (cometG.firstChild) cometG.removeChild(cometG.firstChild)

        const measure = document.createElementNS(SVG_NS, "polyline")
        measure.setAttribute("points", ptStr)
        measure.setAttribute("fill", "none")
        measure.setAttribute("stroke", "none")
        cometG.appendChild(measure)
        const total = measure.getTotalLength()
        if (!total || reduced) return

        const buildSpark = () => {
          const blobs: { el: SVGCircleElement; op: number }[] = []
          for (let i = 0; i < COMET_BLOBS; i++) {
            const t = COMET_BLOBS <= 1 ? 0 : i / (COMET_BLOBS - 1)
            const el = document.createElementNS(SVG_NS, "circle")
            el.setAttribute("fill", "url(#methodCometGlow)")
            el.setAttribute("r", (7 * (1 - 0.72 * t) + 1).toFixed(2))
            cometG.appendChild(el)
            blobs.push({ el, op: Math.pow(1 - t, 1.25) * 0.6 })
          }
          return blobs
        }

        const sparks = [{ blobs: buildSpark(), phase: 0 }]
        const step = 3.2 // tight spacing → blobs overlap into a smooth streak
        const proxy = { head: 0 }

        const place = () => {
          for (const s of sparks) {
            const headL = (proxy.head + s.phase) % total
            const prog = headL / total
            const fade = Math.min(1, prog / 0.07, (1 - prog) / 0.07)
            for (let i = 0; i < s.blobs.length; i++) {
              const b = s.blobs[i]
              const at = headL - i * step
              if (at < 0) {
                b.el.style.opacity = "0"
                continue
              }
              const p = measure.getPointAtLength(at)
              b.el.setAttribute("cx", p.x.toFixed(1))
              b.el.setAttribute("cy", p.y.toFixed(1))
              b.el.style.opacity = (b.op * Math.max(0, fade)).toFixed(3)
            }
          }
        }

        place()
        cometTween = gsap.to(proxy, {
          head: total,
          duration: 5,
          ease: "none",
          repeat: -1,
          onUpdate: place,
        })
      }

      const onRefresh = () => drawSnake()
      ScrollTrigger.addEventListener("refresh", onRefresh)

      if (reduced) {
        nums.forEach((el) => {
          el.textContent = fmt(Number(el.dataset.value), decimalsOf(el), suffixOf(el))
        })
        drawSnake()
        return () => {
          ScrollTrigger.removeEventListener("refresh", onRefresh)
          cometTween?.kill()
        }
      }

      gsap.from(".method__header > *", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".method__header", start: "top 82%", once: true },
      })

      gsap.from(".method-tool", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".method__tools", start: "top 80%", once: true },
      })

      // reveal the steps, then draw the connector through their settled centres
      gsap.from(".method-step", {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: ".method__snake", start: "top 84%", once: true },
        onComplete: drawSnake,
      })

      // count each metric up from zero when the stats row enters view
      nums.forEach((el) => {
        const target = Number(el.dataset.value)
        const decimals = decimalsOf(el)
        const suffix = suffixOf(el)
        const obj = { v: 0 }
        el.textContent = fmt(0, decimals, suffix)
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".method__stats", start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = fmt(obj.v, decimals, suffix)
          },
        })
      })

      // pause the comet's rAF while the section is off-screen (saves battery)
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!cometTween) return
          if (entry.isIntersecting) cometTween.resume()
          else cometTween.pause()
        },
        { rootMargin: "150px" },
      )
      if (snakeEl) io.observe(snakeEl)

      return () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh)
        io.disconnect()
        cometTween?.kill()
      }
    },
    { scope: ref, dependencies: [reduced] },
  )

  return (
    <section id="method" ref={ref} className="method">
      <div className="method__inner">
        <header className="method__header">
          <p className="method__eyebrow">{method.eyebrow}</p>
          <h2 className="method__title">{method.title}</h2>
          <p className="method__lead">{method.lead}</p>
        </header>

        <div className="method__tools">
          {method.tools.map((t, i) => (
            <article
              key={t.name}
              className={`method-tool${i === 1 ? " method-tool--primary" : ""}`}
            >
              <div className="method-tool__top">
                <h3 className="method-tool__name">{t.name}</h3>
                <span className="method-tool__mode">{t.mode}</span>
              </div>
              <p className="method-tool__role">{t.role}</p>
              <p className="method-tool__desc">{t.desc}</p>
              <div className="method-tool__points">
                {t.points.map((p) => (
                  <span key={p} className="method-tool__point">
                    {p}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="method__rule">
          <span className="method__rule-item">
            <b>{method.rule.simple}</b>
            <span className="method__rule-arrow">→</span>
            {method.rule.simpleTool}
          </span>
          <span className="method__rule-sep" aria-hidden="true" />
          <span className="method__rule-item">
            <b>{method.rule.complex}</b>
            <span className="method__rule-arrow">→</span>
            {method.rule.complexTool}
          </span>
        </div>

        <div className="method__stats">
          {method.stats.map((s) => (
            <div key={s.label} className="method-stat">
              <div
                className="method-stat__num"
                data-value={s.value}
                data-decimals={s.decimals ?? 0}
                data-suffix={s.suffix ?? ""}
              >
                {fmt(s.value, s.decimals ?? 0, s.suffix ?? "")}
              </div>
              <div className="method-stat__label">{s.label}</div>
              <div className="method-stat__src">{s.source}</div>
            </div>
          ))}
        </div>

        <div className="method__flow">
          <p className="method__flow-label">{method.flowLabel}</p>
          <div className="method__snake">
            <svg
              className="method__snake-svg"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <defs>
                <radialGradient id="methodCometGlow">
                  <stop offset="0%" stopColor="#f8ffe6" stopOpacity="0.85" />
                  <stop offset="30%" stopColor="#e6f7a8" stopOpacity="0.4" />
                  <stop offset="65%" stopColor="#d3ef76" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#d3ef76" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="method__snake-base" />
              <g className="method__snake-comet" />
            </svg>
            {(() => {
              const indexed = method.steps.map((s, i) => ({ ...s, n: i }))
              const half = Math.ceil(indexed.length / 2)
              const rows = [indexed.slice(0, half), indexed.slice(half)]
              return rows.map((rowSteps, r) => (
                <div
                  key={r}
                  className={`method__snake-row method__snake-row--${r === 0 ? "top" : "bottom"}`}
                >
                  {rowSteps.map((s) => (
                    <div key={s.tag} className="method-step">
                      <span className="method-step__node">
                        {String(s.n + 1).padStart(2, "0")}
                      </span>
                      <div className="method-step__body">
                        <span className="method-step__tag">{s.tag}</span>
                        <h4 className="method-step__title">{s.title}</h4>
                        <p className="method-step__desc">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}
