import { BooleanAnd } from '@unshared/types'

/**
 * Computes the logical [AND](https://en.wikipedia.org/wiki/AND_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are both `true`.
 * @example and(true, true) // true
 */
export function and<A extends boolean, B extends boolean>(a: A, b: B): BooleanAnd<A, B>

/**
 * Computes the logical [AND](https://en.wikipedia.org/wiki/AND_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are `true`.
 * @example and(true, true, true, true) // true
 */
export function and(...values: boolean[]): boolean
export function and(...values: boolean[]): boolean {
  return values.every(Boolean)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true if both parameters are true', () => {
    const result = and(true, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is false', () => {
    const result = and(true, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is false', () => {
    const result = and(false, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the first parameter is true', () => {
    const result = and(false, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are true', () => {
    const result = and(true, true, true, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are false', () => {
    const result = and(true, true, true, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
