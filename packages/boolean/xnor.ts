import { BooleanXnor } from '@unshared/types'

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are the same.
 * @example xnor(false, true) // false
 */
export function xnor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXnor<A, B>

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are the same.
 * @example xnor(false, false, false, false) // true
 */
export function xnor(...values: boolean[]): boolean
export function xnor(...values: boolean[]): boolean {
  return values.every((a, i, array) => a === array[0])
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return true if both parameters are true', () => {
    const result = xnor(true, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is false', () => {
    const result = xnor(true, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is false', () => {
    const result = xnor(false, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the first parameter is false', () => {
    const result = xnor(false, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are false', () => {
    const result = xnor(false, false, false, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return true if all values are true', () => {
    const result = xnor(true, true, true, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are true and some are false', () => {
    const result = xnor(true, true, false, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
