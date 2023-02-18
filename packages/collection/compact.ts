import { NotNil } from '@unshared/types/common'

/**
 * Filters out `undefined` and `null` values from an array.
 *
 * @param value The array to filter
 * @returns The filtered array
 */
export const compact = <T>(value: Array<T>): Array<NotNil<T>> =>
  // @ts-expect-error: `filter` is not typed correctly.
  value.filter(x => x !== undefined && x !== null)

/* c8 ignore next */
if (import.meta.vitest) {
  it('should filter out undefined values', () => {
    const result = compact([true, undefined])
    expect(result).toEqual([true])
  })

  it('should filter out null values', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = compact([true, null])
    expect(result).toEqual([true])
  })

  it('should not filter out falsy values', () => {
    const result = compact([true, false])
    expect(result).toEqual([true, false])
  })
}
