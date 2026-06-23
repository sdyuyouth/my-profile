"use client"

import type { ReactNode } from "react"
import { copyText } from "@/lib/notify"

type Props = {
  value: string
  /** Category label, e.g. "邮箱" → toast reads "邮箱已复制". */
  label?: string
  className?: string
  children: ReactNode
}

export function CopyButton({ value, label, className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => copyText(value, label)}
      aria-label={`点击复制${label ?? ""}：${value}`}
    >
      {children}
    </button>
  )
}
