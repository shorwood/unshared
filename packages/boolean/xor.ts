import { BooleanXor } from '@unshared/types'

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are different.
 * @example xor(false, true) // true
 */
export function xor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXor<A, B>

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if some of the values are different.
 * @example xor(true, false, true, false) // true
 */
export function xor(...values: boolean[]): boolean
export function xor(...values: boolean[]): boolean {
  return values.some((a, i, array) => a !== array[0])
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return true if both parameters are true', () => {
    const result = xor(true, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the first parameter is false', () => {
    const result = xor(true, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the second parameter is false', () => {
    const result = xor(false, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if the first parameter is false', () => {
    const result = xor(false, true)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if some values are true and some are false', () => {
    const result = xor(true, false, true, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are true', () => {
    const result = xor(true, true, true, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are false', () => {
    const result = xor(false, false, false, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
