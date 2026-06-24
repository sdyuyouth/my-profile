import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "@/lib/fonts"
import "./globals.css"

const TITLE = "鲁越森 · 全栈工程师 · Built Everything by Vibe Coding"
const DESCRIPTION =
  "全栈工程师鲁越森，Powered by AI。Vibe Coding 交付 Agent 平台、B2B 独立站与自动化工具。"

// Production origin used to resolve OpenGraph / canonical URLs absolutely.
// Defaults to the live domain so the social preview works without any env setup;
// override with NEXT_PUBLIC_SITE_URL if the domain ever changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://profile.imatrix.tech"

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
    images: [
      { url: "/og.jpg", width: 1197, height: 630, alt: TITLE, type: "image/jpeg" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
