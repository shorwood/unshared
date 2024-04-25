import { BooleanNor } from '@unshared/types'

/**
 * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean
 * @returns `true` if `a` and `b` are `false`.
 * @example nor(false, true) // false
 */
export function nor<A extends boolean, B extends boolean>(a: A, b: B): BooleanNor<A, B>

/**
 * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are `false`.
 * @example nor(false, false, false, false) // true
 */
export function nor(...values: boolean[]): boolean
export function nor(...values: boolean[]): boolean {
  return values.every(a => !a)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return true if both parameters are false', () => {
    const result = nor(false, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is true', () => {
    const result = nor(true, false)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is true', () => {
    const result = nor(false, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if both parameters are true', () => {
    const result = nor(true, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are false', () => {
    const result = nor(false, false, false, false)
    expect(result).toBeTruthy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are true', () => {
    const result = nor(false, false, false, true)
    expect(result).toBeFalsy()
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
