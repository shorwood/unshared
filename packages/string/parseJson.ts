/** Regular expression to match the `__proto__` property. */
const protoRegexp
  = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/

/** Regular expression to match the `constructor` property. */
const constructorRegexp
  = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/

/** Regular expression check if the input is a valid JSON string. */
const jsonRegexp = /^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/

/**
 * Parse a JSON string into a value. This function allows for a faster, secure and
 * more reliable way to parse JSON than the native `JSON.parse()` function.
 *
 * It checks if the input is a know JSON value and if so, it returns the value
 * early. It also checks if the input is a valid JSON string and if not, it just
 * returns `undefined`.
 *
 * Additionally, it will throw an error if there was an attempt to parse a JSON string
 * that contains the `__proto__` or `constructor` property to prevent against possible
 * prototype pollution attacks.
 *
 * @see https://github.com/unjs/destr/blob/main/src/index.ts
 * @param json The JSON string to parse.
 * @returns The parsed JSON value.
 * @example parseJson('{"foo": "bar", "__proto__": "foo"}') // { foo: 'bar' }
 */

export function parseJson<T>(json: string): T | undefined {

  // --- If the input is surrounded by quotes, it's a string.
  json = json.trim()
  const firstChar = json.at(0)
  const lastChar = json.at(-1)
  if (firstChar === '"' && lastChar === '"') return json.slice(1, -1) as T
  if (firstChar === '\'' && lastChar === '\'') return json.slice(1, -1) as T

  // --- Check for known JSON values and return early.
  if (json.length <= 9) {
    const lJson = json.toLowerCase()
    if (lJson === 'true') return true as T
    if (lJson === 'false') return false as T
    if (lJson === 'undefined') return undefined as T
    // eslint-disable-next-line unicorn/no-null
    if (lJson === 'null') return null as T
    if (lJson === 'nan') return Number.NaN as T
    if (lJson === 'infinity') return Number.POSITIVE_INFINITY as T
    if (lJson === '-infinity') return Number.NEGATIVE_INFINITY as T
  }

  // --- Check if the input looks like a number and return early.
  if (/^-?\d[\d.]{0,14}$/.test(json)) {
    const result = Number(json)
    const isNan = Number.isNaN(result)
    if (!isNan) return result as T
  }

  // --- If the input does not look like JSON, throw an error.
  if (!jsonRegexp.test(json)) return undefined

  // --- Check for prototype pollution and throw an error if found.
  const isPolluted = protoRegexp.test(json) || constructorRegexp.test(json)

  // --- Parse using the native JSON.parse() function.
  try {
    return isPolluted
      ? JSON.parse(json, (k, v) => ((k === '__proto__' || k === 'constructor') ? undefined : v as unknown)) as T
      : JSON.parse(json) as T
  }
  catch { return undefined }
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should parse a quoted string into a string', () => {
    const result = parseJson('"foo"')
    expect(result).toBe('foo')
  })

  test('should parse a single quoted string into a string', () => {
    const result = parseJson('\'foo\'')
    expect(result).toBe('foo')
  })

  test('should parse a "true" into a boolean', () => {
    const result = parseJson('true')
    expect(result).toBe(true)
  })

  test('should parse a "false" into a boolean', () => {
    const result = parseJson('false')
    expect(result).toBe(false)
  })

  test('should parse a "undefined" into undefined', () => {
    const result = parseJson('undefined')
    expect(result).toBeUndefined()
  })

  test('should parse a "null" into null', () => {
    const result = parseJson('null')

    expect(result).toBeNull()
  })

  test('should parse a "NaN" into Number.NaN', () => {
    const result = parseJson('NaN')
    expect(result).toStrictEqual(Number.NaN)
  })

  test('should parse a "Infinity" into Number.POSITIVE_INFINITY', () => {
    const result = parseJson('Infinity')
    expect(result).toStrictEqual(Number.POSITIVE_INFINITY)
  })

  test('should parse a "-Infinity" into Number.NEGATIVE_INFINITY', () => {
    const result = parseJson('-Infinity')
    expect(result).toStrictEqual(Number.NEGATIVE_INFINITY)
  })

  test('should parse a string integer into a number', () => {
    const result = parseJson('123')
    expect(result).toBe(123)
  })

  test('should parse a string float into a number', () => {
    const result = parseJson('123.456')
    expect(result).toStrictEqual(123.456)
  })

  test('should parse a string negative integer into a number', () => {
    const result = parseJson('-123')
    expect(result).toBe(-123)
  })

  test('should parse a string negative float into a number', () => {
    const result = parseJson('-123.456')
    expect(result).toBe(-123.456)
  })

  test('should return undefined if the input is not a valid JSON string', () => {
    const result = parseJson('foo')
    expect(result).toBeUndefined()
  })

  test('should return remove the __proto__ property if the input is a valid JSON string', () => {
    const result = parseJson('{"__proto__": "foo", "bar": "baz"}')
    expect(result).toStrictEqual({ bar: 'baz' })
  })

  test('should return remove the constructor property if the input is a valid JSON string', () => {
    const result = parseJson('{"constructor": "foo", "bar": "baz"}')
    expect(result).toStrictEqual({ bar: 'baz' })
  })

  test('should parse a JSON string into an object', () => {
    const result = parseJson('{"foo": "bar"}')
    expect(result).toStrictEqual({ foo: 'bar' })
  })
}
