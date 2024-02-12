import { compare } from '../functions/compare'

// TODO: Implement `get` path iterator
// TODO: Implement `sortBy` values iterator: `sort(array)`
// TODO: Rename `sortBy` with `sort`

interface SortBy {
  <T, K extends keyof T>(array: T[], path: K): T[]
  <T>(array: T[], iterator: (value: T, key: number, array: T[]) => any): T[]
}

/**
 * Sorts an array by the result of an iterator function.
 *
 * @param array The array to sort
 * @param iterator The iterator function or path
 * @returns The sorted array
 */
export const sortBy: SortBy = (array: any[], iterator: any): any[] => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Sort with custom comparator.
  return array.sort((a: any, b: any) => compare(
    iterator(a),
    iterator(b),
  ))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('sorts an array by the result of an iterator function', () => {
    const array = [1, 2, 3]
    const result = sortBy(array, x => x * -1)
    expect(result.length).toEqual(array.length)
    expect(result).toEqual([3, 2, 1])
  })

  it('sorts an array by the result of a path', () => {
    const array = [{ a: 3 }, { a: 2 }, { a: 1 }]
    const result = sortBy(array, 'a')
    expect(result.length).toEqual(array.length)
    expect(result).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  })
}
