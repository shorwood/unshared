import { readFile } from 'node:fs/promises'
import { parseJson } from './parseJson'

/**
 * Imports data from a JSON file.
 * @param path The path to the JSON file
 * @returns A promise that resolves to the parsed JSON data
 * @throws If the JSON file is invalid
 */
export const loadObject = async <T = unknown>(path: string): Promise<T> => {
  const json = await readFile(path, 'utf8')
  return parseJson<T>(json)
}
