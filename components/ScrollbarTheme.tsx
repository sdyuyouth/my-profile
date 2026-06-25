"use client"

import { useEffect } from "react"

// Adaptive scrollbar. The browser won't blend scrollbar pseudo-elements, and a
// transparent track just reveals the <body> canvas colour (a light strip over
// the dark sections). So we read the background of whichever section sits under
// the viewport centre and:
//   • paint the TRACK with that exact colour, so it fuses with the section and
//     reads as "no background";
//   • set the THUMB to a translucent colour that contrasts with it.
const THUMB_ON_DARK = "rgba(255, 255, 255, 0.45)"
const THUMB_ON_LIGHT = "rgba(0, 0, 0, 0.32)"

function luminance(color: string) {
  const m = color.match(/\d+(\.\d+)?/g)
  if (!m) return 255
  const [r, g, b] = m.map(Number)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function ScrollbarTheme() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > *"),
    )
    if (sections.length === 0) return

    const root = document.documentElement
    let lastTrack = ""

    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight / 2
      const here =
        sections.find((s) => {
          const r = s.getBoundingClientRect()
          return r.top <= mid && r.bottom >= mid
        }) ?? sections[0]

      const track = getComputedStyle(here).backgroundColor
      if (track === lastTrack) return
      lastTrack = track
      root.style.setProperty("--scrollbar-track", track)
      root.style.setProperty(
        "--scrollbar-thumb",
        luminance(track) < 128 ? THUMB_ON_DARK : THUMB_ON_LIGHT,
      )
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return null
}
