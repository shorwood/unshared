/**
 * A value that can be converted to a `number` type.
 */
export type NumberLike = number | bigint | boolean | string

/**
 * Cast a number-like value to a number.
 *
 * @param value The value to cast to a number.
 * @returns The converted number.
 * @example
 * toNumber(42) // 42
 * toNumber(42n) // 42
 * toNumber(true) // 1
 * toNumber('42.0') // 42
 * toNumber('foo') // 0
 * toNumber({}) // 0
 */
export const toNumber = (value: NumberLike): number => {
  // --- If the value is a string, try to parse it as a number.
  if (typeof value === 'string') value = Number.parseFloat(value)

  // --- If the value is a number, return it.
  if (typeof value === 'number') {
    if (Number.isFinite(value) === false)
      throw new Error(`Cannot cast non-finite number "${value}" to a number.`)
    return value
  }

  // --- If the value is a boolean, cast it to a number.
  if (typeof value === 'boolean') return value ? 1 : 0

  // --- If the value is a bigint, cast it to a number.
  if (typeof value === 'bigint') return Number(value)

  // --- If the value is not a number-like value, throw an error.
  throw new Error(`Cannot cast ${value} to a number.`)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should cast a number to a number', () => {
    const result = toNumber(42)
    expect(result).toEqual(42)
  })

  it('should cast a bigint to a number', () => {
    const result = toNumber(42n)
    expect(result).toEqual(42)
  })

  it('should cast a boolean to a number', () => {
    const result = toNumber(true)
    expect(result).toEqual(1)
  })

  it('should cast a string to a number', () => {
    const result = toNumber('42.0')
    expect(result).toEqual(42)
  })

  it('should cast a string to a number', () => {
    const result = toNumber('foo')
    expect(result).toEqual(0)
  })

  it('should fallback to 0', () => {
    const result = toNumber({})
    expect(result).toEqual(0)
  })
}
