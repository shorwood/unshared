import type { Key } from './Key'
import type { Values } from './Values'

/**
 * Function that is used to iterate over a collection.
 *
 * @template T The type of the collection.
 * @template R The type of the return value.
 * @example
 * type Collection = { a: number, b: string }
 * type Iteratee = IteratorFunction<Collection, boolean> // (value: number | string, key: 'a' | 'b', object: Collection) => boolean
 */
export type IteratorFunction<T = unknown, R = unknown> = (value: Values<T>, key: Key<T>, object: T) => R
