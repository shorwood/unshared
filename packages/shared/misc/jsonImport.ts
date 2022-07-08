import { requireSafe } from './requireSafe'
import { jsonParse } from './jsonParse'

/**
 * Imports data from a JSON file.
 * @param {string} path The path to the JSON file
 * @returns {any} The parsed JSON data
 */
export const jsonImport = <T>(path: string): T | undefined => {
  // --- Import `fs` safely
  const fs = requireSafe('node:fs')

  // --- Make sure FS is available and the file exists
  if (!fs) return undefined
  if (!fs.existsSync(path)) return undefined

  // --- Get the JSON data and parse it
  const json = fs.readFileSync(path, 'utf8')
  return jsonParse<T>(json)
}
