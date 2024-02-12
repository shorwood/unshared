/**
 * Assert that a value is an array. If not, throw a `ValidationError`.
 *
 * @param value The value to assert
 * @returns `true` if value is an array, `false` otherwise
 * @example asseryArray([]) // true
 */
export function isArray<T>(value?: T[]): value is T[]
export function isArray(value?: unknown): value is unknown[]
export function isArray(value?: unknown): value is unknown[] {
  return Array.isArray(value)
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should return true if value is an array', () => {
    const result = isArray([])
    expect(result).toEqual(true)
  })

  it('should return false if value is an object', () => {
    const result = isArray({})
    expect(result).toEqual(false)
  })

  it('should return false if value is undefined', () => {
    const result = isArray()
    expect(result).toEqual(false)
  })

  it('should predicate if value is an array of unknown', () => {
    const value = [] as unknown
    const result = isArray(value)
    if (result) expectTypeOf(value).toEqualTypeOf<unknown[]>()
  })

  it('should predicate if value is an array of strings', () => {
    const value = [] as string[]
    const result = isArray(value)
    if (result) expectTypeOf(value).toEqualTypeOf<string[]>()
  })
}
