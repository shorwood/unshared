import { createList } from './createList'
import { createListNode } from './createListNode'
import { isList } from './isList'
import { listPush } from './listPush'
import { List, ListNode } from './types'

/**
 * Removes the last node from the list and returns it.
 *
 * @param list The list to pop from.
 * @returns The last node of the list.
 * @throws If the value is not a list.
 * @example listPop(list) // 3
 */
export function listPop<T>(list: List<T>): ListNode<T> | undefined {
  if (isList(list) === false)
    throw new TypeError('Cannot pop from non-list')
  if (list.length === 0) return undefined

  // --- Get last node.
  const node = list.last

  // --- Remove last node.
  if (node) {
    if (node.prev) {
      node.prev.next = undefined
      list.last = node.prev
    }
    else {
      list.first = undefined
      list.last = undefined
    }
    list.length--
  }

  // --- Return last node.
  return node!
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should pop the last node from the list', () => {
    const node = createListNode(true)
    const list = createList(3)
    listPush(list, node)
    const result = listPop(list)
    expect(result).toEqual(node)
  })

  it('should return undefined if the list is empty', () => {
    const list = createList()
    const result = listPop(list)
    expect(result).toEqual(undefined)
    expect(list.length).toEqual(0)
  })

  it('should update the length of the list', () => {
    const list = createList(3)
    listPop(list)
    expect(list.length).toEqual(2)
  })

  it('should update the last node of the list', () => {
    const list = createList(3)
    listPop(list)
    expect(list.last).toEqual(list.first?.next)
  })

  it('should update the next node of the previous last node', () => {
    const list = createList(3)
    listPop(list)
    expect(list.last?.next).toEqual(undefined)
  })

  it('should update the first node of the list the list is now empty', () => {
    const list = createList(1)
    listPop(list)
    expect(list.first).toEqual(undefined)
  })

  it('should throw if the value is not a list', () => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => listPop({ first: undefined, last: undefined, length: 0 })
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the type of the returned node', () => {
    const list = createList(3, true)
    const result = listPop(list)
    expectTypeOf(result).toEqualTypeOf<ListNode<boolean> | undefined>()
  })
}
