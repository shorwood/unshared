/* eslint-disable @typescript-eslint/no-var-requires */
import { jsonParse } from './jsonParse'

/**
 * Load and parse JSON file.
 * @param path Path to file.
 * @returns JSON content as object.
 */
export const jsonImport = <T extends string | number | boolean | JSON | null | undefined>(path: string, encoding?: BufferEncoding) =>
  jsonParse<T>(require('node:fs').readFileSync(path).toString(encoding))
