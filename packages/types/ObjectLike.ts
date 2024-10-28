/**
 * An `ObjectLike` is an object that can be used as a dictionary or a record.
 * This type is similar to the `Record` type, but has default generic types
 * and their order are swapped.
 *
 * @template V The type of the values in the object.
 * @template K The type of the keys in the object.
 * @example ObjectLike<number, string> // { [key: string]: number }
 */
export type ObjectLike<V = unknown, K extends PropertyKey = string> = Record<K, V>
