import { createList } from './createList'
import { createListFromArray } from './createListFromArray'
import { isList } from './isList'
import { List, ListNode } from './types'

/**
 * Returns the element at the given index in the list.
 *
 * @param list The list to get the element from.
 * @param index The index of the element to get.
 * @returns The list node at the given index.
 * @throws If the value is not a list or the index is not a number.
 */
export function listAt<T>(list: List<T>, index: number): ListNode<T> | undefined {
  if (isList(list) === false)
    throw new TypeError('Expected list to be a list')
  if (typeof index !== 'number')
    throw new TypeError('Expected index to be a number')
  if (list.length === 0 || index > list.length)
    return undefined

  // --- Find and return the node at the given index.
  let node = list.first
  while (index--) node = node!.next
  return node
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the first node', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listAt(list, 0)
    expect(result).toEqual(list.first)
    expect(result!.value).toEqual(1)
  })

  it('should return the last node', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listAt(list, 2)
    expect(result).toEqual(list.last)
    expect(result!.value).toEqual(3)
  })

  it('should return undefined if the index is out of bounds', () => {
    const list = createList(3)
    const result = listAt(list, 3)
    expect(result).toEqual(undefined)
  })

  it('should infer the type of the list', () => {
    const list = createList<boolean>(3)
    const result = listAt(list, 0)
    expectTypeOf(result).toEqualTypeOf<ListNode<boolean> | undefined>()
  })

  it('should allow the type of the list to be overridden', () => {
    const list = createList<any>(3)
    const result = listAt<boolean>(list, 0)
    expectTypeOf(result).toEqualTypeOf<ListNode<boolean> | undefined>()
  })
}
