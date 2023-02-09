/**
 * Check if value is `false`.
 *
 * @param value The value to check.
 * @returns `true` if value is `false`.
 * @throws If value is not a boolean.
 * @example isFalse(false) // true
 */
export function isFalse(value: true): false
export function isFalse(value: false): true
export function isFalse(value: boolean): value is false
export function isFalse(value: boolean): boolean {
  if (typeof value !== 'boolean')
    throw new TypeError('Value must be a boolean')
  return value === false
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true when checking if false is false', () => {
    const result = isFalse(false)
    expect(result).toEqual(true)
  })

  it('should return false when checking if true is false', () => {
    const result = isFalse(true)
    expect(result).toEqual(false)
  })

  it('should throw when value is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => isFalse(1)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should predicate the type of the value if it is false', () => {
    const value = false as boolean
    const result = isFalse(value)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (result) expectTypeOf(value).toEqualTypeOf<false>()
  })

  it('should predicate the type of the value if it is true', () => {
    const value = true as boolean
    const result = isFalse(value)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (!result) expectTypeOf(value).toEqualTypeOf<true>()
  })
}
