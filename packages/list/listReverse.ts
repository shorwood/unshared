/* eslint-disable unicorn/prevent-abbreviations */
import { createList } from './createList'
import { isList } from './isList'
import { List, ListNode } from './types'
import { createListFromArray } from './createListFromArray'
import { listValues } from './listValues'

/**
 * Reverses the order of the elements in the list.
 *
 * @param list The list to reverse.
 * @returns The reversed list.
 * @example list.reverse() // [3, 2, 1]
 */
export const listReverse = <T>(list: List<T>): List<T> => {
  if (isList(list) === false)
    throw new TypeError('Expected parameter to be a list')
  if (list.first === list.last)
    return list

  // --- Initialize variables.
  let node: ListNode<T> | undefined = list.first
  let next: ListNode<T> | undefined = list.first?.next
  let prev: ListNode<T> | undefined

  // --- Reverse the list.
  while (node) {
    node.next = prev
    node.prev = next
    prev = node
    node = next
    next = node?.next
  }

  // --- Update the list's first and last nodes.
  list.first = prev
  list.last = list.first

  // --- Return the reversed list.
  return list
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should reverse the list and return the reversed list', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listReverse(list)
    const resultArray = listValues(result)
    expect(result).toEqual(list)
    expect(resultArray).toEqual([3, 2, 1])
  })

  it('should return the list if it is empty', () => {
    const list = createList()
    const result = listReverse(list)
    expect(result).toEqual(list)
  })

  it('should return the list if it has only one node', () => {
    const list = createList(1)
    const result = listReverse(list)
    expect(result).toEqual(list)
  })
}
