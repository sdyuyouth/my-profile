import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  // build artifacts / reference material — never lint these
  { ignores: ["dist/**", "out/**", ".next/**", "node_modules/**", "_ref/**"] },
  ...compat.extends("next/core-web-vitals"),
]

export default config
