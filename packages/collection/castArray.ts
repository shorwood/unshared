import { MaybeArray, Nil } from '@unshared/types'

/**
 * Wrap a value into an array if it is not one already. If the value is
 * `undefined` or `null`, an empty array is returned.
 *
 * @param value The value to wrap.
 * @returns The arrayified value.
 * @example castArray(1) // [1]
 */
export function castArray(value?: Nil): []
export function castArray<U>(value?: MaybeArray<U>): U[]
export function castArray(value?: unknown): unknown[] {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the array if the value is an array', () => {
    const result = castArray([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should return an array with the value if the value is not an array', () => {
    const result = castArray(1)
    expect(result).toEqual([1])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should return an empty array if the value is undefined', () => {
    const result = castArray()
    expect(result).toEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>
  })

  it('should return an empty array if the value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = castArray(null)
    expect(result).toEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>
  })
}
