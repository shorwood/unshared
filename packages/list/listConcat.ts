import { createListFromArray } from './createListFromArray'
import { isList } from './isList'
import { listValues } from './listValues'
import { List } from './types'

/**
 * Concatenates two lists together. Unlike the `Array.prototype.concat()` method, this
 * function mutates the first list and the first node of the second list.
 *
 * @param source The list to concatenate to.
 * @param target The list to concatenate.
 * @returns The mutated list.
 * @example
 * const listA = createListFromArray([1, 2, 3])
 * const listB = createListFromArray([4, 5, 6])
 * const result = listConcat(listA, listB)
 * listValues(listA) // [1, 2, 3, 4, 5, 6]
 * listValues(listB) // [4, 5, 6]
 * listValues(result) // [1, 2, 3, 4, 5, 6]
 */
export function listConcat(source: List, target: List): List {
  if (isList(source) === false)
    throw new TypeError('Expected parameter a to be a list')
  if (isList(target) === false)
    throw new TypeError('Expected parameter b to be a list')

  // --- Append the second list to the first list.
  source.last!.next = target.first
  target.first!.prev = source.last
  source.last = target.last
  source.length += target.length

  // --- Return the first list.
  return source
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should concatenate two lists', () => {
    const listA = createListFromArray([1, 2, 3])
    const listB = createListFromArray([4, 5, 6])
    const result = listConcat(listA, listB)
    const resultArray = listValues(result)
    expect(result).toEqual(listA)
    expect(resultArray).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('should throw an error if the first parameter is not a list', () => {
    const list = createListFromArray([1, 2, 3])
    const shouldThrow = () => listConcat(list, list)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the second parameter is not a list', () => {
    const list = createListFromArray([1, 2, 3])
    const shouldThrow = () => listConcat(list, list)
    expect(shouldThrow).toThrow(TypeError)
  })
}
