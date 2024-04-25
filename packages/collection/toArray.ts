import { MaybeArray, Nil } from '@unshared/types'

/**
 * Wrap a value into an array if it is not one already. If the value is
 * `undefined` or `null`, an empty array is returned.
 *
 * @param value The value to wrap.
 * @returns The arrayified value.
 * @example toArray(1) // [1]
 */
export function toArray(value?: Nil): []
export function toArray<U>(value?: MaybeArray<U>): U[]
export function toArray(value?: unknown): unknown[] {

  // --- Return an empty array if the value is undefined or null.
  if (value === undefined || value === null) return []

  // --- Return the array if the value is already an array.
  return Array.isArray(value)
    ? value as unknown[]
    : [value]
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return the array if the value is an array', () => {
    const result = toArray([1, 2, 3])
    expect(result).toStrictEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  test('should return an array with the value if the value is not an array', () => {
    const result = toArray(1)
    expect(result).toStrictEqual([1])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  test('should return an empty array if the value is undefined', () => {
    const result = toArray()
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>()
  })

  test('should return an empty array if the value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = toArray(null)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>()
  })
}
