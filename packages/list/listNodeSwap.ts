/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/prevent-abbreviations */
import { createListFromArray } from './createListFromArray'
import { createListNode } from './createListNode'
import { isListNode } from './isListNode'
import { listAt } from './listAt'
import { listValues } from './listValues'
import { List, ListNode } from './types'

/**
 * Swap the order of two nodes. Optionally, a list can be provided to
 * update the list's first and last nodes if necessary.
 *
 * @param first The first node.
 * @param second The second node.
 * @param list The list to update.
 */
export function listNodeSwap<T>(first: ListNode<T>, second: ListNode<T>, list?: List<T>): void {
  if (isListNode(first) === false)
    throw new TypeError('Expected first parameter to be a list node')
  if (isListNode(second) === false)
    throw new TypeError('Expected second parameter to be a list node')
  if (list && isListNode(list.first) === false)
    throw new TypeError('Expected list.first to be a list node')
  if (first === second)
    return

  // --- Initialize variables.
  const firstPrev = first.prev
  const firstNext = first.next
  const secondPrev = second.prev
  const secondNext = second.next

  // --- Swap the nodes.
  first.prev = secondPrev
  first.next = secondNext
  second.prev = firstPrev
  second.next = firstNext

  // --- Update the previous and next nodes.
  if (firstPrev) firstPrev.next = second
  if (firstNext) firstNext.prev = second
  if (secondPrev) secondPrev.next = first
  if (secondNext) secondNext.prev = first

  // --- Update the list's first and last nodes.
  if (list) {
    if (list.first === first) list.first = second
    else if (list.first === second) list.first = first
    if (list.last === first) list.last = second
    else if (list.last === second) list.last = first
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should swap the order of two nodes', () => {
    const first = createListNode('first')
    const second = createListNode('second')
    listNodeSwap(first, second)
    expect(first.prev).toBeUndefined()
    expect(first.next).toBe(second)
    expect(second.prev).toBe(first)
    expect(second.next).toBeUndefined()
  })

  it('should swap the order of two nodes and update the list', () => {
    const list = createListFromArray([1, 2, 3, 4])
    const second = listAt(list, 1) as ListNode<number>
    const third = listAt(list, 2) as ListNode<number>
    listNodeSwap(second, third, list)
    const result = listValues(list)
    expect(result).toEqual([1, 3, 2, 4])
  })

  it('should swap the order of two nodes and update first and last nodes', () => {
    const list = createListFromArray([1, 2, 3, 4])
    const first = listAt(list, 0) as ListNode<number>
    const last = listAt(list, 3) as ListNode<number>
    listNodeSwap(first, last, list)
    const result = listValues(list)
    expect(result).toEqual([4, 2, 3, 1])
    expect(list.first).toBe(last)
    expect(list.last).toBe(first)
  })

  it('should throw an error if the first parameter is not a list node', () => {
    // @ts-expect-error: Testing error handling.
    const shouldThrow = () => listNodeSwap('not-a-list-node', createListNode())
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the second parameter is not a list node', () => {
    // @ts-expect-error: Testing error handling.
    const shouldThrow = () => listNodeSwap(createListNode(), 'not-a-list-node')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the third parameter is not a list', () => {
    // @ts-expect-error: Testing error handling.
    const shouldThrow = () => listNodeSwap(createListNode(), createListNode(), 'not-a-list')
    expect(shouldThrow).toThrow(TypeError)
  })
}
