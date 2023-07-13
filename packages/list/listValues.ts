import { createList } from './createList'
import { isList } from './isList'
import { List } from './types'

/**
 * Converts a list to an array.
 *
 * @param list The list to convert.
 * @returns The array of values.
 * @throws If the first parameter is not a list.
 * @example listValues(list) // [1, 2, 3]
 */
export function listValues<T>(list: List<T>): T[] {
  if (isList(list) === false)
    throw new TypeError('Cannot convert non-list to array')

  // --- Create array.
  const array: T[] = Array.from({ length: list.length })

  // --- Iterate over list.
  let index = 0
  let node = list.first
  while (node) {
    array[index++] = node.value as T
    node = node.next
  }

  // --- Return array.
  return array
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert a list to an array', () => {
    const list = createList(3)
    list.first!.value = 1
    list.first!.next!.value = 2
    list.first!.next!.next!.value = 3
    const result = listValues(list)
    expect(result).toEqual([1, 2, 3])
  })

  it('should return an empty array if the list is empty', () => {
    const list = createList()
    const result = listValues(list)
    expect(result).toEqual([])
  })

  it('should throw an error if the value is not a list', () => {
    const value = { first: undefined, last: undefined, length: 0 } as unknown
    const shouldThrow = () => listValues(value as any)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the type of the array', () => {
    const list = createList<number>(3)
    const result = listValues(list)
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should allow the type of the array to be overridden', () => {
    const list = createList<any>(3)
    const result = listValues<string>(list)
    expectTypeOf(result).toEqualTypeOf<string[]>()
  })
}
