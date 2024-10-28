/**
 * Push a type to the end of a tuple type. If the tuple is empty, a tuple with
 * the pushed type is returned.
 *
 * @template T The tuple to push to.
 * @template U The type to push.
 * @example TuplePush<[1, 2, 3], 4> // [1, 2, 3, 4]
 */
export type TuplePush<T extends unknown[], U> = T extends [...infer V] ? [...V, U] : [U]
