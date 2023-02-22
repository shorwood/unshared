import { Key } from './Key'
import { MathDecrease } from './MathDecrease'
import { Values } from './Values'

/**
 * Extract value of an object.
 *
 * @template T Object type
 * @template K Key to get value from
 * @returns Value at path.
 */
// @ts-expect-error: ignore
export type Get<T, K> = K extends Key<T> ? T[K] : never

/**
 * Extract nested value of an object recursively.
 *
 * @template T Object type
 * @template P Path to get value from
 * @template N Depth of recursion
 * @returns Value at path.
 */
export type Value<T, P = '', N extends number = 5> =
  // --- If P key of T, return value
  P extends (Key<T> | `${Key<T>}`) ? Get<T, P>

    // --- If recursion threashold, return `unknown`.
    : N extends 0 ? unknown

      // --- Extract current segment.
      : P extends `${infer K}.${infer PNext}`

        // --- First segment is key of the object, recurse
        ? K extends (Key<T> | `${Key<T>}`)
          ? Value<Values<T>, PNext, MathDecrease<N>>
          | Extract<T, undefined>

          // --- Path is invalid
          : never

        // --- Path is invalid
        : never

/**
 * Collection with it's values defaulted by an other object.
 *
 * @template T Collection type
 * @template U Default collection type
 * @returns New collection
 * @TODO: Add support for nested defaults.
 */
export type Defaulted<T, U> = {
  [P in keyof T]: P extends keyof U
    ? T[P] extends undefined | undefined ? U[P] : T[P]
    : T[P]
}
