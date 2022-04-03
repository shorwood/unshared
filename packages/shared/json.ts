/* eslint-disable unicorn/no-null */
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Parse to JSON.
 * @param json String to parse.
 * @returns Parsed JSON value.
 * @see https://github.com/unjs/destr
 * @see https://github.com/fastify/secure-json-parse
 * @see https://github.com/hapijs/bourne
 */
export const jsonParse = <T extends string | number | boolean | JSON | null | undefined>(json: string): T => {
  if (typeof json !== 'string') return json

  // --- Return the value early.
  const value = json.toLowerCase()
  if (value === 'true') return <T>true
  if (value === 'false') return <T>false
  if (value === 'null') return <T>null
  if (value === 'nan') return <T>Number.NaN
  if (value === 'infinity') return <T>Number.POSITIVE_INFINITY
  if (value === 'undefined') return <T>undefined

  // --- If the input looks like invalid JSON, return input.
  if (!/^["[{]|^-?\d[\d.]{0,14}$/.test(json)) return <T>json

  // --- Parse the old way but delete `__proto__` and `constuctor` properties if need be.
  try {
    return (
      /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/.test(json)
      || /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/.test(json))
      ? JSON.parse(json, (k, v) => ((k === '__proto__' || k === 'constructor') ? undefined : v))
      : JSON.parse(json)
  }

  // --- On error, returns input.
  catch { return <T>json }
}

/**
 * Load and parse JSON file.
 * @param path Path to file.
 * @returns JSON content as object.
 */
export const jsonImport = <T extends string | number | boolean | JSON | null | undefined>(path: string, encoding?: BufferEncoding) =>
  jsonParse<T>(readFileSync(path).toString(encoding))

/**
 * Save object as JSON file.
 * @param path Path to file.
 * @param object Object to save.
 */
export const jsonExport = (path: string, object: JSON) => {
  writeFileSync(path, JSON.stringify(object, undefined, 2))
}
