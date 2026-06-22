import type { CSSProperties, ElementType } from "react"

type Props = {
  children: string
  shadowColor?: string
  as?: ElementType
  className?: string
}

export function LineShadowText({
  children,
  shadowColor = "#dc5935",
  as: Tag = "span",
  className = "",
}: Props) {
  return (
    <Tag
      className={`line-shadow-text ${className}`.trim()}
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      data-text={children}
    >
      {children}
    </Tag>
  )
}
