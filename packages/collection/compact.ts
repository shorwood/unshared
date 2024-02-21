import { NotNil } from '@unshared/types'

/**
 * Filters out `undefined` and `null` values from an array.
 *
 * @param value The array to filter
 * @returns The filtered array
 * @example compact([0, 1, undefined, 2, null, 3]) // => [0, 1, 2, 3]
 */
export function compact<T>(value: T[]): Array<NotNil<T>> {
  return value.filter(x => x !== undefined && x !== null) as Array<NotNil<T>>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should filter out undefined values', () => {
    const result = compact([true, undefined, true])
    expect(result).toEqual([true, true])
    expectTypeOf(result).toEqualTypeOf<boolean[]>()
  })

  it('should filter out null values', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = compact([true, null, true])
    expect(result).toEqual([true, true])
    expectTypeOf(result).toEqualTypeOf<boolean[]>()
  })

  it('should not filter out falsy values', () => {
    const result = compact([false, 0, 0n, ''])
    expect(result).toEqual([false, 0, 0n, ''])
    expectTypeOf(result).toEqualTypeOf<Array<bigint | boolean | number | string>>()
  })

  it('should infer the type of the result if the input is a tuple', () => {
    const result = compact([1, undefined] as [1, undefined])
    expect(result).toEqual([1])
    expectTypeOf(result).toEqualTypeOf<Array<1>>()
  })
}
