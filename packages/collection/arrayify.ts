import { Array } from '@unshared/types/Array'
import { MaybeArray } from '@unshared/types/MaybeArray'
import { Nil } from '@unshared/types/Nil'

/**
 * Wrap a value into an array if it is not one already. If the value is
 * `undefined` or `null`, an empty array is returned.
 *
 * @param value The value to wrap.
 * @returns The arrayified value.
 * @example arrayify(1) // [1]
 */
export function arrayify(value?: Nil): []
export function arrayify<U>(value?: Array<U>): Array<U>
export function arrayify<U>(value?: MaybeArray<U>): Array<U>
export function arrayify(value?: MaybeArray): unknown[] {
  if (value === undefined || value === null) return []
  if (Array.isArray(value)) return value
  return [value]
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the array if the value is an array', () => {
    const result = arrayify([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('should return an array with the value if the value is not an array', () => {
    const result = arrayify(1)
    expect(result).toEqual([1])
  })

  it('should return an empty array if the value is undefined', () => {
    const result = arrayify()
    expect(result).toEqual([])
  })

  it('should return an empty array if the value is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = arrayify(null)
    expect(result).toEqual([])
  })
}
