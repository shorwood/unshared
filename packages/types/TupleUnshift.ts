/**
 * Unshift an element into a tuple type. If the tuple is empty, a tuple with the
 * prepended element is returned.
 *
 * @template T The tuple to prepend to.
 * @template U The element to prepend.
 * @example TupleUnshift<[1, 2, 3], 0> // [0, 1, 2, 3]
 */
export type TupleUnshift<T extends unknown[], U> = T extends [...infer V] ? [U, ...V] : [U]
