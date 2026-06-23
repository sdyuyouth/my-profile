import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import { fontVariables } from "@/lib/fonts"
import "./globals.css"

const TITLE = "鲁越森 · 全栈工程师 · Built Everything by Vibe Coding"
const DESCRIPTION =
  "全栈工程师鲁越森，Powered by AI。Vibe Coding 交付 Agent 平台、B2B 独立站与自动化工具。"

// Set NEXT_PUBLIC_SITE_URL to the production origin in Cloudflare Pages env vars
// so OpenGraph / canonical URLs resolve absolutely. Falls back to localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "鲁越森" }],
  keywords: [
    "鲁越森",
    "全栈工程师",
    "Vibe Coding",
    "AI Agent",
    "Spec-Driven Development",
    "Cursor",
    "Claude Code",
    "Cloudflare",
    "个人作品集",
  ],
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "鲁越森 · 个人作品集",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1197, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={fontVariables}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
