# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page dark-themed personal portfolio/resume site for 鲁越森 (full-stack engineer, "Built Everything by Vibe Coding"). One scroll page, five sections: Hero → Work → Journey → Method → Contact. UI copy is in Chinese.

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # static export → out/  (this is the deploy artifact)
npm run lint     # eslint (next/core-web-vitals)
```

- No test suite exists.
- `npm run start` does **not** work — `next start` is incompatible with `output: "export"`. To preview the production build, serve the static folder: `npx serve out`.
- Deploy target is Cloudflare Pages: build command `npm run build`, output directory `out`.

## Architecture

- **Static export Next.js 15 App Router.** `next.config.ts` sets `output: "export"`, so everything must be statically renderable — no server actions, route handlers, or runtime server code.
- **`app/page.tsx` is a `"use client"` component** that composes the global overlays (`PageProgress`, `SmoothCursor`, `Notifications`) + the five `sections/`. `app/layout.tsx` sets metadata (incl. OpenGraph/Twitter) and applies `fontVariables` to `<html>`.
- **`data/site.ts` is the single source of all content and types** (`site`, `profile`, `marqueeTools`, `projects`, `experience`, `method`, `statusLabels`, plus the `Project`/`Experience`/`StackLayer`/`MethodData` types). Content edits happen here only — sections read from it and need no changes. `statusLabels` maps `ProjectStatus` (`local-dev` | `closed` | `open`) to its badge text, and a project's `status` drives whether Live/Repo links render.
- **`sections/`** = the five page sections. **`components/`** = reusable pieces (`Providers`, `PageProgress`, `BlurReveal`, `LineShadowText`, `StackFlow`, `TechLanes`, `SmoothCursor`, `Notifications`, `CopyButton`).
- **Contact info is click-to-copy, not links.** Phone/email render as `CopyButton`s that call `copyText()` in `lib/notify.ts` (a tiny pub/sub toast store); `Notifications` subscribes and renders the animated-list toast stack. No `tel:`/`mailto:` anchors.
- **`app/globals.css`** is the entire stylesheet (~2000 lines, Tailwind v4 via `@import "tailwindcss"`). No CSS modules. Class naming is BEM-like (`block__element--modifier`); design tokens are CSS variables in `:root` (`--bg-dark`, `--accent`, `--accent-2`, `--pad`, `--max`, …). Style by adding/keying off these classes, not inline styles.
- Path alias `@/*` → repo root (e.g. `@/lib/gsap`, `@/data/site`).

## Animation conventions (important)

- **Always import GSAP from `@/lib/gsap`**, never from `gsap` directly. `lib/gsap.ts` registers the `ScrollTrigger` plugin exactly once; importing elsewhere risks an unregistered plugin.
- Animations use `useGSAP` from `@gsap/react` with `{ scope: ref, dependencies: [...] }`.
- **Every animated component must honor reduced motion.** Call `useReducedMotion()` (from `@/hooks/useMotion`) and, when true, `gsap.set(...)` the elements straight to their final visible state instead of animating. This pattern is repeated in every section — match it.
- There is **no Lenis / smooth-scroll library**. `components/Providers.tsx` uses native scroll and just calls `ScrollTrigger.update()` on scroll. (The README's mention of Three.js / R3F / Lenis is stale — none are installed or used.)
- **Hero anti-FOUC pattern:** initial hidden state is set in CSS (`.hero:not(.hero--revealed) …` under `@media (prefers-reduced-motion: no-preference)`), the intro timeline plays once (guarded by a module-level `heroIntroPlayed` flag so it doesn't replay on re-mount/HMR), then `revealHero()` adds `.hero--revealed` and clears the inline GSAP props. When editing the Hero, keep CSS initial state and the JS reveal in sync.
- **Work section is the complex one.** On desktop (`pinned = !reduced && !mobile`, mobile breakpoint 800px) it uses a `ScrollTrigger` pin with scroll-driven slide switching (imperative refs, `runSwitch`, crossfade timelines). On mobile or reduced-motion it degrades to a plain tab switcher rendering one project at a time. Test both paths when changing it.
- **Method section's flow connector is an SVG drawn from measured DOM positions.** `Method.tsx` reads the actual `.method-step__node` centres (re-measured on `ScrollTrigger` "refresh"), threads a polyline through them, colours per-segment by progress, and glides a soft radial-gradient "comet" along it. Below 1040px the two-row serpentine collapses to a vertical list. Counters animate up on scroll-in.
- **`SmoothCursor`** runs its own rAF spring (no framer-motion). It hides the native cursor (`html.smooth-cursor-active`) only while the page is focused and the pointer is inside; gated to `(pointer: fine)` and disabled under reduced motion.

## Build / deploy notes

- `next/font/google` (`lib/fonts.ts`) **fetches fonts from Google at build time** — the build needs network. Cloudflare Pages CI has it; an offline build will fail at the font fetch. (To remove that external dependency, switch to `next/font/local` with checked-in woff2.)
- Clipboard copy needs a secure context — fine on Cloudflare (HTTPS) and localhost; `lib/notify.ts` has an `execCommand` fallback.

## Reference material

`_ref/` (gitignored) holds unrelated design reference material; `DESIGN-DRAFT.md` is the original layout spec and may lag the implemented copy.
