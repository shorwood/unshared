import { BooleanOr } from '@unshared/types'

/**
 * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` or `b` is `true`.
 * @example or(false, true) // true
 */
export function or<A extends boolean, B extends boolean>(a: A, b: B): BooleanOr<A, B>

/**
 * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if at least one of the values is `true`.
 * @example or(true, false, false, false) // true
 */
export function or(...values: boolean[]): boolean
export function or(...values: boolean[]): boolean {
  return values.some(Boolean)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true if both parameters are true', () => {
    const result = or(true, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the first parameter is true', () => {
    const result = or(true, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the second parameter is true', () => {
    const result = or(false, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if both parameters are false', () => {
    const result = or(false, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if some values are true', () => {
    const result = or(false, false, false, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are false', () => {
    const result = or(false, false, false, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
