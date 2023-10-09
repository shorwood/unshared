import { NotNil } from '@unshared/types'

/**
 * Filters out `undefined` and `null` values from an array.
 *
 * @param value The array to filter
 * @returns The filtered array
 * @example compact([0, 1, undefined, 2, null, 3]) // => [0, 1, 2, 3]
 */
export function compact<T>(value: Array<T>): Array<NotNil<T>> {
  return value.filter(x => x !== undefined && x !== null) as Array<NotNil<T>>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should filter out undefined values', () => {
    const result = compact([1, undefined])
    expect(result).toEqual([1])
    expectTypeOf(result).toEqualTypeOf<Array<number>>()
  })

  it('should filter out null values', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = compact([true, null])
    expect(result).toEqual([true])
    expectTypeOf(result).toEqualTypeOf<Array<boolean>>()
  })

  it('should not filter out falsy values', () => {
    const result = compact([true, false])
    expect(result).toEqual([true, false])
    expectTypeOf(result).toEqualTypeOf<Array<boolean>>()
  })
}
