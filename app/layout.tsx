import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import { fontVariables } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "鲁越森 · 全栈工程师 · Built Everything by Vibe Coding",
  description:
    "全栈工程师鲁越森，Powered by AI。Vibe Coding 交付 Agent 平台、B2B 独立站与自动化工具。",
  icons: { icon: "/favicon.svg" },
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
