import { ListNode, ListNodeSymbol, createListNode } from './createListNode'

/**
 * Check if value is a linked list node.
 *
 * @param value The value to check
 * @returns `true` if value is a linked list node.
 * @example isListNode(list.first) // true
 */
export function isListNode<T>(value: unknown): value is ListNode<T> {
  return typeof value === 'object'
    && value !== null
    && ListNodeSymbol in value
    && value[ListNodeSymbol] === true
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if value is a list node', () => {
    const listNode = createListNode() as unknown
    const result = isListNode(listNode)
    expect(result).toEqual(true)
    if (result) expectTypeOf(listNode).toEqualTypeOf<ListNode<unknown>>()
  })

  it('should return false if value is not a list node', () => {
    const value = { value: undefined, next: undefined, prev: undefined } as unknown
    const result = isListNode(value)
    expect(result).toEqual(false)
    if (!result) expectTypeOf(value).not.toEqualTypeOf<ListNode<unknown>>()
  })
}
