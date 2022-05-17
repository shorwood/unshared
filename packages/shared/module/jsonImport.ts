/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { requireSafe } from './requireSafe'
import { jsonParse } from './jsonParse'

interface JsonImport {
  <T>(path: string): T
  (path: string): string | number | boolean | JSON | null | undefined
}

/**
 * Load and parse JSON file.
 * @param path Path to file.
 * @returns JSON content as object.
 */
export const jsonImport: JsonImport = (path: string): any => {
  const fs = requireSafe('node:fs')
  if (fs) return jsonParse(fs.readFileSync(path).toString())
}
