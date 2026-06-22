import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "鲁越森 · 全栈工程师 · Built Everything by Vibe Coding",
  description:
    "全栈工程师鲁越森，Powered by AI。Vibe Coding 交付 Agent 平台、B2B 独立站与自动化工具。",
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
