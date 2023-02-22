import { createList } from './createList'
import { createListNode } from './createListNode'
import { isList } from './isList'
import { listUnshift } from './listUnshift'
import { List, ListNode } from './types'

/**
 * Shifts the first element off the list and returns it.
 *
 * @param list The list to shift the first element from.
 * @returns The first element of the list.
 * @throws If the value is not a list.
 * @example listShift(list) // 1
 */
export function listShift<T>(list: List<T>): ListNode<T> | undefined {
  if (isList(list) === false)
    throw new TypeError('Cannot shift from non-list')
  if (list.length === 0) return undefined

  // --- Get first node.
  const node = list.first

  // --- Remove first node.
  if (node) {
    if (node.next) {
      node.next.prev = undefined
      list.first = node.next
    }
    else {
      list.first = undefined
      list.last = undefined
    }
    list.length--
  }

  // --- Return first node.
  return node!
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should shift the first node from the list', () => {
    const node = createListNode(true)
    const list = createList(3)
    listUnshift(list, node)
    const result = listShift(list)
    expect(result).toEqual(node)
  })

  it('should return undefined if the list is empty', () => {
    const list = createList()
    const result = listShift(list)
    expect(result).toEqual(undefined)
    expect(list.length).toEqual(0)
  })

  it('should update the length of the list', () => {
    const list = createList(3)
    listShift(list)
    expect(list.length).toEqual(2)
  })

  it('should update the last node of the list if the list has only one node', () => {
    const list = createList(1)
    listShift(list)
    expect(list.last).toEqual(undefined)
  })

  it('should update the first node of the list', () => {
    const list = createList(3)
    listShift(list)
    expect(list.first).toEqual(list.last?.prev)
  })
}
