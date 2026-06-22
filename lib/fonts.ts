import { DM_Mono, DM_Sans, Noto_Sans_SC } from "next/font/google"

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
  adjustFontFallback: true,
})

export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  adjustFontFallback: true,
})

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  adjustFontFallback: true,
})

export const fontVariables = `${dmSans.variable} ${notoSansSC.variable} ${dmMono.variable}`
