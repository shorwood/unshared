import { List, createList } from './createList'
import { isList } from './isList'

/**
 * Copies the elements of a list into a new list.
 *
 * @param list The list to copy.
 * @returns The new list.
 * @throws If the first parameter is not a list.
 * @example listClone([1, 2, 3]) // [1, 2, 3]
 */
export const listClone = <T>(list: List<T>): List<T> => {
  if (isList(list) === false)
    throw new TypeError('Expected first parameter to be a list')
  if (list.length === 0)
    return createList<T>()

  // --- Create new list.
  const newList = createList<T>(list.length)

  // --- Iterate over list.
  let node = list.first
  let newNode = newList.first
  while (node) {
    newNode!.value = node.value
    node = node.next
    newNode = newNode!.next
  }

  // --- Return new list.
  return newList
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should copy a list', () => {
    const list = createList(3)
    list.first!.value = 1
    list.first!.next!.value = 2
    list.first!.next!.next!.value = 3
    const result = listClone(list)
    expect(result).toEqual(list)
    expect(result).not.toBe(list)
  })

  it('should return an empty list if the list is empty', () => {
    const list = createList()
    const result = listClone(list)
    expect(result).toEqual(list)
  })

  it('should throw an error if the value is not a list', () => {
    const value = { first: undefined, last: undefined, length: 0 } as unknown
    const shouldThrow = () => listClone(value as any)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the type of the list', () => {
    const list = createList<number>(3)
    const result = listClone(list)
    expectTypeOf(result).toEqualTypeOf<List<number>>()
  })

  it('should allow the type of the list to be overridden', () => {
    const list = createList<number>(3)
    const result = listClone<number>(list)
    expectTypeOf(result).toEqualTypeOf<List<number>>()
  })
}
