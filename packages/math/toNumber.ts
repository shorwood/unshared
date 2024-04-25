/**
 * A value that can be converted to a `number` type.
 */
export type NumberLike = bigint | boolean | number | string

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
export function toNumber(value: NumberLike): number {

  // --- If the value is a string, try to parse it as a number.
  if (typeof value === 'string') {
    const castValue = Number.parseFloat(value)
    if (Number.isFinite(castValue) === false)
      throw new Error(`Cannot cast non-number string "${value}" to a number.`)
    return castValue
  }

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
  const valueToString = Object.prototype.toString.call(value)
  throw new Error(`Cannot cast ${valueToString} to a number.`)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should cast a number to a number', () => {
    const result = toNumber(42)
    expect(result).toBe(42)
  })

  test('should cast a bigint to a number', () => {
    const result = toNumber(42n)
    expect(result).toBe(42)
  })

  test('should cast a boolean to a number', () => {
    const result = toNumber(true)
    expect(result).toBe(1)
  })

  test('should cast a string to a number', () => {
    const result = toNumber('42.0')
    expect(result).toBe(42)
  })

  test('should throw an error if the string is not a number', () => {
    const shouldThrow = () => toNumber('foo')
    expect(shouldThrow).toThrow('Cannot cast non-number string "foo" to a number.')
  })

  test('should throw an error if the value is not a number-like value', () => {

    // @ts-expect-error: Test non-number-like value
    const shouldThrow = () => toNumber({})
    expect(shouldThrow).toThrow('Cannot cast [object Object] to a number.')
  })
}
