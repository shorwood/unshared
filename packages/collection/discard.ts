import { MaybeArray } from '@unshared/types/MaybeArray'
import { IteratedFunction } from '@unshared/types/IteratedFunction'

interface Discard {
  <T>(array: Array<T>, iterator: IteratedFunction<T, boolean>): Array<T>
  <T>(array: Array<T>, discarded: MaybeArray<T>): Array<T>
}

/**
 * Discards values from an array according to the given predicate function.
 *
 * @param object The array to filter
 * @param iterator The function to call for each value. If this is a path (string or array), the function will get that value.
 * @returns A new array with only the values for which the iterator function returned false.
 */
export const discard: Discard = (object: Array<any>, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const discarded = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any) => discarded.includes(value)
  }

  // --- If array, use built-in function.
  return object.filter((value, index, array) => !iterator(value, index, array))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('discards values from an array', () => {
    const result = discard([2, 2, 3, 4, 5], [2, 3])
    expect(result).toEqual([4, 5])
  })

  it('discards values from a value', () => {
    const result = discard([2, 2, 3, 4, 5], 3)
    expect(result).toEqual([2, 2, 4, 5])
  })

  it('discards values from an array according to a predicate function', () => {
    const result = discard([2, 2, 3, 4, 5], value => value % 2 === 0)
    expect(result).toEqual([3, 5])
  })
}
