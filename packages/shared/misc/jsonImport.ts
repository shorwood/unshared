import { requireSafe } from './requireSafe'
import { jsonParse } from './jsonParse'

/**
 * Imports a JSON file.
 * @param {string} path The path to the JSON file
 * @returns {any} The parsed JSON data
 */
export const jsonImport = <T>(path: string): T | undefined => {
  const fs = requireSafe('node:fs')
  if (!fs) return undefined
  return jsonParse<T>(fs.readFileSync(path).toString())
}
