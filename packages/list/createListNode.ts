/* eslint-disable unicorn/prevent-abbreviations */
/**
 * A symbol used to identify a list node.
 */
export const ListNodeSymbol = Symbol('isListNode')

/**
 * A linked list node.
 *
 * @template T The type of the node's value.
 * @example type ListNode = ListNode<number> // { value?: number, next?: ListNode<number>, prev?: ListNode<number> }
 */
export interface ListNode<T = unknown> {
  readonly [ListNodeSymbol]: true
  /**
   * The value of the node.
   */
  value?: T
  /**
   * The next node in the list.
   */
  next?: ListNode<T>
  /**
   * The previous node in the list.
   */
  prev?: ListNode<T>
}

/**
 * Creates a list node with the specified value.
 *
 * @param value The value of the node.
 * @param prev The previous node in the list.
 * @param next The next node in the list.
 * @returns A new list node.
 * @example createListNode(1) // { value: 1, next: undefined, prev: undefined }
 */
export function createListNode<T>(value?: T, prev?: ListNode<T>, next?: ListNode<T>): ListNode<T> {
  const listNode = { value, next, prev } as ListNode<T>

  // --- Flag as a list node with a symbol.
  Object.defineProperty(listNode, ListNodeSymbol, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  })

  // --- Return the list node.
  return listNode
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a node without a value', () => {
    const result = createListNode()
    expect(result).toEqual({
      value: undefined,
      next: undefined,
      prev: undefined,
    })
  })

  it('should create a node with a value', () => {
    const result = createListNode(1)
    expect(result).toEqual({
      value: 1,
      next: undefined,
      prev: undefined,
    })
  })

  it('should create a node with a value and a next node', () => {
    const next = createListNode()
    const result = createListNode(1, undefined, next)
    expect(result).toEqual({
      value: 1,
      next,
      prev: undefined,
    })
  })

  it('should create a node with a value and a previous node', () => {
    const prev = createListNode()
    const result = createListNode(1, prev)
    expect(result).toEqual({
      value: 1,
      next: undefined,
      prev,
    })
  })

  it('should infer the type of the value', () => {
    const result = createListNode(1)
    expectTypeOf(result).toEqualTypeOf<ListNode<number>>()
  })

  it('should allow to specify the type of the value', () => {
    const result = createListNode<number>()
    expectTypeOf(result).toEqualTypeOf<ListNode<number>>()
  })

  it('should not allow ListNodeSymbol flag to be changed', () => {
    const listNode = createListNode()
    // @ts-expect-error: should be invalid
    const shouldThrow = () => (listNode[ListNodeSymbol] = false)
    expect(shouldThrow).toThrow(TypeError)
  })
}
