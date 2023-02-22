/**
 * A symbol used to identify a list.
 */
export const ListSymbol = Symbol('isList')

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
