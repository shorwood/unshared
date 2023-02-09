/**
 * Check if value is a boolean.
 *
 * @param value The value to check
 * @returns `true` if value is a boolean.
 * @example isBoolean(true) // true
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/* c8 ignore next */
if (import.meta.vitest) {
  it ('should return true when checking if true is a boolean', () => {
    const result = isBoolean(true)
    expect(result).toEqual(true)
  })

  it ('should return true when checking if false is a boolean', () => {
    const result = isBoolean(false)
    expect(result).toEqual(true)
  })

  it ('should return false when checking if 1 is a boolean', () => {
    const result = isBoolean(1)
    expect(result).toEqual(false)
  })

  it ('should return false when checking if "true" is a boolean', () => {
    const result = isBoolean('true')
    expect(result).toEqual(false)
  })

  it('should indicate the type of the value', () => {
    const value = true as unknown
    const result = isBoolean(value)
    if (result) expectTypeOf(value).toEqualTypeOf<boolean>()
  })
}
