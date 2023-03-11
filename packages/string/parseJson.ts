/* eslint-disable unicorn/no-unsafe-regex */
/* eslint-disable unicorn/no-null */

/**
 * Parse a JSON string into a value.
 *
 * @param json The JSON string to parse.
 * @returns The parsed value.
 * @throws If the JSON string is invalid.
 * @see https://github.com/unjs/destr
 */
export const parseJson = <T = unknown>(json: string): T => {
  if (typeof json !== 'string')
    throw new TypeError('Cannot parse non-string JSON.')

  // --- Return the value early.
  const value = json.toLowerCase().trim()
  if (value === 'true') return true as any
  if (value === 'false') return false as any
  if (value === 'null') return null as any
  if (value === 'nan') return Number.NaN as any
  if (value === 'infinity') return Number.POSITIVE_INFINITY as any
  if (value === 'undefined') return undefined as any

  // --- If the input looks like invalid JSON, return input.
  if (!/^["[{]|^-?\d[\d.]{0,14}$/.test(json)) throw new SyntaxError('Invalid JSON.')

  // --- Parse the old way but delete `__proto__` and `constuctor` properties if need be.
  return (
    /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/.test(json)
        || /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/.test(json))
    ? JSON.parse(json, (k, v) => ((k === '__proto__' || k === 'constructor') ? undefined : v))
    : JSON.parse(json)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each(['true', 'false', 'null', 'NaN', 'Infinity', 'undefined'])('should parse %s', (value) => {
    const result = parseJson(value)
    expect(result).toEqual(JSON.parse(value))
  })

  it('should parse a JSON string', () => {
    const result = parseJson('{"foo": "bar"}')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('should throw an error if the input is not a string', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => parseJson(true)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it.each(['salami', '{ foo: "bar" }', '1e1000', '1e-1000'])('should throw an error if the input is invalid JSON', (value) => {
    const shouldThrow = () => parseJson(value)
    expect(shouldThrow).toThrowError(SyntaxError)
  })

  it('should delete `__proto__` and `constructor` properties', () => {
    const result = parseJson('{"__proto__": "foo", "constructor": "bar"}')
    expect(result).toEqual({})
  })
}
