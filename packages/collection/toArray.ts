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
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the array if the value is an array', () => {
    const result = toArray([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should return an array with the value if the value is not an array', () => {
    const result = toArray(1)
    expect(result).toEqual([1])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should return an empty array if the value is undefined', () => {
    const result = toArray()
    expect(result).toEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>
  })

  it('should return an empty array if the value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = toArray(null)
    expect(result).toEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>
  })
}
