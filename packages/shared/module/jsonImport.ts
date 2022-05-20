/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { requireSafe } from './requireSafe'
import { jsonParse } from './jsonParse'

interface JsonImport {
  <T>(path: string): T
  (path: string): string | number | boolean | JSON | null | undefined
}

/**
 * Imports a JSON file.
 * @param {string} path The path to the JSON file
 * @returns {any} The parsed JSON data
 */
export const jsonImport: JsonImport = (path: string): any => {
  const fs = requireSafe('node:fs')
  if (fs) return jsonParse(fs.readFileSync(path).toString())
}
