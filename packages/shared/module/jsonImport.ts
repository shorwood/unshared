import { readFileSync } from 'node:fs'
import { jsonParse } from './jsonParse'

/**
 * Imports data from a JSON file.
 * @param path The path to the JSON file
 * @returns The parsed JSON data
 * @throws If the JSON file is invalid
 */
export const jsonImport = <T>(path: string): T => {
  // --- Read and parse the JSON file.
  const json = readFileSync(path, 'utf8')
  const result = jsonParse<T>(json)

  // --- Throw an error if the JSON is invalid.
  if (!result) throw new Error(`Failed to parse the JSON file at path: "${path}"`)

  // --- Return the parsed JSON data.
  return result
}
