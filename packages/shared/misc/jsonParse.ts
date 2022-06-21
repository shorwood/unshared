/* eslint-disable unicorn/no-null */

/**
 * Parse to JSON.
 * @param {string} json String to parse.
 * @returns {string | number | boolean | JSON | null | undefined} Parsed JSON value.
 * @see https://github.com/unjs/destr
 * @see https://github.com/fastify/secure-json-parse
 * @see https://github.com/hapijs/bourne
 */
export const jsonParse = <T>(json: string): T => {
  if (typeof json !== 'string') throw new Error('Could not parse JSON, input is not a string.')

  // --- Return the value early.
  const value = json.toLowerCase()
  if (value === 'true') return true as any
  if (value === 'false') return false as any
  if (value === 'null') return null as any
  if (value === 'nan') return Number.NaN as any
  if (value === 'infinity') return Number.POSITIVE_INFINITY as any
  if (value === 'undefined') return undefined as any

  // --- If the input looks like invalid JSON, return input.
  if (!/^["[{]|^-?\d[\d.]{0,14}$/.test(json)) return json as any

  // --- Parse the old way but delete `__proto__` and `constuctor` properties if need be.
  return (
    /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/.test(json)
      || /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/.test(json))
    ? JSON.parse(json, (k, v) => ((k === '__proto__' || k === 'constructor') ? undefined : v))
    : JSON.parse(json)
}
