export type ToastData = {
  id: number
  title: string
  detail?: string
  tone?: "ok" | "error"
}

type Listener = (toast: ToastData) => void

const listeners = new Set<Listener>()
let counter = 0

export function subscribeToasts(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function push(toast: Omit<ToastData, "id">) {
  const full: ToastData = { id: ++counter, ...toast }
  listeners.forEach((l) => l(full))
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fallback for insecure contexts / older browsers
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

/** Copy `value` to the clipboard and raise a toast confirming (or reporting) it. */
export async function copyText(value: string, label?: string) {
  const ok = await writeClipboard(value)
  if (ok) {
    push({ title: label ? `${label}已复制` : "已复制", detail: value, tone: "ok" })
  } else {
    push({ title: "复制失败", detail: value, tone: "error" })
  }
}
