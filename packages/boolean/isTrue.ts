
/**
 * Check if value is `true`.
 *
 * @param value The value to check.
 * @returns `true` if value is `true`.
 * @throws If value is not a boolean.
 * @example isTrue(true) // true
 */
export function isTrue(value: true): true
export function isTrue(value: false): false
export function isTrue(value: boolean): value is true
export function isTrue(value: boolean): boolean {
  if (typeof value !== 'boolean')
    throw new TypeError('Value must be a boolean')
  return value === true
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true when checking if true is true', () => {
    const result = isTrue(true)
    expect(result).toEqual(true)
  })

  it('should return false when checking if false is true', () => {
    const result = isTrue(false)
    expect(result).toEqual(false)
  })

  it('should throw when value is not a boolean', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => isTrue(1)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should predicate the type of the value if it is true', () => {
    const value = true as boolean
    const result = isTrue(value)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (result) expectTypeOf(value).toEqualTypeOf<true>()
  })

  it('should predicate the type of the value if it is false', () => {
    const value = false as boolean
    const result = isTrue(value)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (!result) expectTypeOf(value).toEqualTypeOf<false>()
  })
}
