import { createList } from './createList'
import { createListNode } from './createListNode'
import { isList } from './isList'
import { isListNode } from './isListNode'
import { List, ListNode } from './types'

/**
 * Insert a node at the end of the list.
 *
 * @param list The list to push to.
 * @param value The value or node to push.
 * @returns The new length of the list.
 * @throws If the value is not a list.
 * @example listPush(list, true) // 2
 */
export function listPush<T>(list: List<T>, value: T | ListNode<T>): number {
  if (isList(list) === false)
    throw new TypeError('Cannot push to non-list')

  // --- Push node at end of list.
  const node = isListNode(value) ? value : createListNode(value)
  if (list.last) {
    list.last.next = node
    node.prev = list.last
  }
  else { list.first = node }

  // --- Update list state.
  list.last = node
  list.length++

  // --- Return new length.
  return list.length
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should push a node to an empty list and return the new length', () => {
    const list = createList()
    const node = createListNode(1)
    const result = listPush(list, node)
    expect(result).toEqual(1)
  })

  it('should push a node to the end of the list and return the new length', () => {
    const list = createList(3)
    const node = createListNode(1)
    const result = listPush(list, node)
    expect(result).toEqual(4)
  })

  it('should push a value to an empty list and return the new length', () => {
    const list = createList()
    const result = listPush(list, 1)
    expect(result).toEqual(1)
  })

  it('should push a value to the end of the list and return the new length', () => {
    const list = createList(3)
    const result = listPush(list, 1)
    expect(result).toEqual(4)
  })

  it('should update the length of the list', () => {
    const list = createList(3)
    const result = listPush(list, 1)
    expect(result).toEqual(4)
    expect(list.length).toEqual(4)
  })

  it('should update the last node of the list', () => {
    const node = createListNode(1)
    const list = createList(3)
    const result = listPush(list, node)
    expect(result).toEqual(4)
    expect(list.last).toEqual(node)
  })

  it('should update the next node of the previous last node', () => {
    const node = createListNode(1)
    const list = createList(3)
    const result = listPush(list, node)
    expect(result).toEqual(4)
    expect(list.last!.prev!.next).toEqual(list.last)
  })

  it('should update the first node of the list if the list was empty', () => {
    const node = createListNode(1)
    const list = createList()
    const result = listPush(list, node)
    expect(result).toEqual(1)
    expect(list.first).toEqual(node)
  })

  it('should throw if the value is not a list', () => {
    const node = createListNode(1)
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => listPush({ first: undefined, last: undefined, length: 0 }, node)
    expect(shouldThrow).toThrow(TypeError)
  })
}
