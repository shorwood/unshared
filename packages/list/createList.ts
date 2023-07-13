import { ListNode, createListNode } from './createListNode'

/**
 * A symbol used to identify a list.
 */
export const ListSymbol = Symbol('List')

/**
 * A linked list.
 *
 * @template T The type of the list's values.
 * @example type List = List<number> // { first?: ListNode<number>, last?: ListNode<number>, length: number }
 */
export interface List<T = unknown> {
  readonly [ListSymbol]: true
  /**
   * The first element of the list.
   */
  first?: ListNode<T>
  /**
   * The last element of the list.
   */
  last?: ListNode<T>
  /**
   * The length of the list.
   */
  length: number
}

/**
 * Create a new linked list of N elements.
 *
 * @param length The length of the list.
 * @returns A new linked list.
 * @throws If the first parameter is not a number.
 * @example createList(3) // [undefined, undefined, undefined]
 */
export function createList<T>(length = 0): List<T> {
  // --- Handle edge cases.
  if (typeof length !== 'number')
    throw new TypeError('Expected length to be a number')
  if (length < 0)
    throw new RangeError('Expected length to be a positive number')

  // --- Initialize the list with a first node.
  const list = {
    first: length > 0 ? createListNode() : undefined,
    last: undefined,
    length,
  } as unknown as List<T>

  // --- Flag as a list with a symbol.
  Object.defineProperty(list, ListSymbol, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  })

  // --- Fill the list.
  let node = list.first
  for (let index = 1; index < length; index++)
    node = node!.next = createListNode(undefined, node)

  // --- Set the last node.
  list.last = node

  // --- Return the list.
  return list
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create an empty list', () => {
    const list = createList()
    expect(list.length).toEqual(0)
    expect(list.first).toEqual(undefined)
    expect(list.last).toEqual(undefined)
    expect(list[ListSymbol]).toEqual(true)
  })

  it('should create a list with the given length', () => {
    const list = createList(3)
    expect(list.length).toEqual(3)
  })

  it('should be traversable from first to last', () => {
    const list = createList(3)
    expect(list.first!.value).toEqual(undefined)
    expect(list.first!.next!.value).toEqual(undefined)
    expect(list.first!.next!.next!.value).toEqual(undefined)
    expect(list.first!.next!.next!.next).toEqual(undefined)
  })

  it('should be traversable from last to first', () => {
    const list = createList(3)
    expect(list.last!.value).toEqual(undefined)
    expect(list.last!.prev!.value).toEqual(undefined)
    expect(list.last!.prev!.prev!.value).toEqual(undefined)
    expect(list.last!.prev!.prev!.prev).toEqual(undefined)
  })

  it('should reference the same nodes from first to last', () => {
    const list = createList(3)
    expect(list.first).toEqual(list.last!.prev!.prev)
    expect(list.first!.next).toEqual(list.last!.prev)
    expect(list.first!.next!.next).toEqual(list.last)
  })

  it('should throw if the length is not a number', () => {
    // @ts-expect-error: should be invalid
    const shouldThrow = () => createList('3')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if the length is negative', () => {
    const shouldThrow = () => createList(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should allow to specify the type of the list', () => {
    const list = createList<string>()
    expectTypeOf(list).toEqualTypeOf<List<string>>()
    expectTypeOf(list.first).toEqualTypeOf<ListNode<string> | undefined>()
  })

  it('should not allow ListSymbol flag to be changed', () => {
    const list = createList()
    // @ts-expect-error: should be invalid
    const shouldThrow = () => (list[ListSymbol] = false)
    expect(shouldThrow).toThrow(TypeError)
  })
}
