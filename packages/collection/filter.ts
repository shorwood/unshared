import { MaybeArray } from '@unshared/types/MaybeArray'
import { IteratedFunction } from '@unshared/types/IteratedFunction'

interface Filter {
  <T>(array: Array<T>, iterator: IteratedFunction<T, boolean>): Array<T>
  <T>(array: Array<T>, filtered: MaybeArray<T>): Array<T>
}

/**
 * Filter values from an array according to the given predicate function.
 *
 * @param object The array to filter
 * @param iterator The function to call for each value. If this is a path (string or array), the function will get that value.
 * @returns A new array with only the values for which the iterator function returned false.
 */
export const filter: Filter = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const filtered = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any) => filtered.includes(value)
  }

  // --- If array, use built-in function.
  return object.filter((value: any, index: any, array: any) => iterator(value, index, array))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('filters values from an array', () => {
    expect(filter([2, 2, 3, 4, 5], [2, 3, 5])).toEqual([2, 2, 3, 5])
  })

  it('filters values from a value', () => {
    expect(filter([2, 2, 3, 4, 5], 2)).toEqual([2, 2])
  })

  it('filters values from an array according to a predicate function', () => {
    expect(filter([2, 2, 3, 4, 5], value => value % 2 === 0)).toEqual([2, 2, 4])
  })
}
