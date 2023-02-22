import { createList } from './createList'
import { createListNode } from './createListNode'
import { isList } from './isList'
import { isListNode } from './isListNode'
import { List, ListNode } from './types'

/**
 * Insert a node at the start of the list.
 *
 * @param list The list to unshift to.
 * @param value The value or node to unshift.
 * @returns The new length of the list.
 * @throws If the value is not a list.
 * @example listUnshift(list, true) // 2
 */
export function listUnshift<T>(list: List<T>, value: T | ListNode<T>): number {
  // --- Validate list.
  if (!isList(list))
    throw new TypeError('Cannot unshift to non-list')

  // --- Unshift node at start of list.
  const node = isListNode(value) ? value : createListNode(value)
  if (list.first) {
    list.first.prev = node
    node.next = list.first
  }
  else { list.last = node }

  // --- Update list state.
  list.first = node
  list.length++

  // --- Return new length.
  return list.length
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should unshift a node to an empty list and return the new length', () => {
    const list = createList()
    const node = createListNode(1)
    const result = listUnshift(list, node)
    expect(result).toEqual(1)
  })

  it('should unshift a node to the start of the list and return the new length', () => {
    const list = createList(3)
    const node = createListNode(1)
    const result = listUnshift(list, node)
    expect(result).toEqual(4)
  })

  it('should unshift a value to an empty list and return the new length', () => {
    const list = createList()
    const result = listUnshift(list, 1)
    expect(result).toEqual(1)
  })

  it('should unshift a value to the start of the list and return the new length', () => {
    const list = createList(3)
    const result = listUnshift(list, 1)
    expect(result).toEqual(4)
  })

  it('should update the length of the list', () => {
    const list = createList(3)
    const result = listUnshift(list, 1)
    expect(result).toEqual(4)
    expect(list.length).toEqual(4)
  })

  it('should update the first node of the list', () => {
    const node = createListNode(1)
    const list = createList(3)
    const result = listUnshift(list, node)
    expect(result).toEqual(4)
    expect(list.first).toEqual(node)
  })

  it('should update the prev node of the previous first node', () => {
    const node = createListNode(1)
    const list = createList(3)
    const result = listUnshift(list, node)
    expect(result).toEqual(4)
    expect(list.first!.next!.prev).toEqual(list.first)
  })

  it('should update the last node of the list if the list was empty', () => {
    const node = createListNode(1)
    const list = createList()
    const result = listUnshift(list, node)
    expect(result).toEqual(1)
    expect(list.last).toEqual(node)
  })

  it('should throw if the value is not a list', () => {
    const node = createListNode(1)
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => listUnshift({ first: undefined, last: undefined, length: 0 }, node)
    expect(shouldThrow).toThrow(TypeError)
  })
}
