"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import type { StackLayer } from "@/data/site"

type Props = {
  layers: StackLayer[]
  projectId: string
  layout?: "vertical" | "horizontal"
}

export function StackFlow({ layers, projectId, layout = "vertical" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const horizontal = layout === "horizontal"

  useGSAP(
    () => {
      if (!rootRef.current) return
      const rows = rootRef.current.querySelectorAll(
        horizontal ? ".stack-flow__col" : ".stack-flow__row",
      )
      const nodes = rootRef.current.querySelectorAll(".stack-flow__node")
      const pipe = rootRef.current.querySelector(
        horizontal ? ".stack-flow__pipe-h-fill" : ".stack-flow__pipe-fill",
      )

      gsap.fromTo(
        rows,
        { opacity: 0, ...(horizontal ? { y: 12 } : { x: -16 }) },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power3.out",
        },
      )
      gsap.fromTo(
        nodes,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.03,
          delay: 0.1,
          ease: "back.out(1.5)",
        },
      )
      if (pipe) {
        gsap.fromTo(
          pipe,
          horizontal ? { scaleX: 0 } : { scaleY: 0 },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.5,
            ease: "power2.out",
          },
        )
      }
    },
    { scope: rootRef, dependencies: [projectId, horizontal] },
  )

  if (horizontal) {
    return (
      <div ref={rootRef} className="stack-flow stack-flow--horizontal">
        <div className="stack-flow__pipe-h" aria-hidden>
          <div className="stack-flow__pipe-h-fill" />
        </div>
        <div className="stack-flow__cols">
          {layers.map((layer, i) => (
            <div key={`${projectId}-${layer.layer}`} className="stack-flow__col">
              <span className="stack-flow__layer-name">{layer.layer}</span>
              <div className="stack-flow__nodes">
                {layer.items.map((item, j) => (
                  <span
                    key={item}
                    className="stack-flow__node stack-flow__node--sm"
                    style={{ "--node-i": i * 3 + j } as React.CSSProperties}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="stack-flow">
      <div className="stack-flow__pipe" aria-hidden>
        <div className="stack-flow__pipe-fill" />
      </div>

      {layers.map((layer, i) => (
        <div key={`${projectId}-${layer.layer}`} className="stack-flow__row">
          <div className="stack-flow__layer">
            <span className="stack-flow__layer-name">{layer.layer}</span>
          </div>
          <div className="stack-flow__nodes">
            {layer.items.map((item, j) => (
              <span
                key={item}
                className="stack-flow__node"
                style={{ "--node-i": i * 3 + j } as React.CSSProperties}
              >
                <span className="stack-flow__node-dot" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
