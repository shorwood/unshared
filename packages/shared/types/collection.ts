import { Decrease } from './arithmetic'
import { NotNil } from './common'

/**
 * Collection of items in the form of an object or an array.
 * @param T The type of the items in the collection.
 * @param K The type of the keys in the collection.
 * @returns The collection.
 */
export type Collection<T, K = any> = K extends number
  ? T[] | readonly T[]
  : { [P in Extract<K, string>]: T }

// <T, K extends Path<T>>(object: Collection<T>, path: K): Record<Literal<Value<T, K>>, Array<T>>

/**
 * Values of an array or object
 * @param T The collection to get the values from
 * @returns The values of the collection
 */
export type Values<T = object> = T extends string | any[] | readonly any[]
  ? T[number]
  : T extends object
    ? T[keyof T]
    : never

/**
 * Extract the keys of an object.
 * @param T The object to extract the keys from
 * @return The keys of the object
 */
export type Key<T = any> = T extends string | any[] | readonly any[]
  ? Extract<keyof T, number>
  : T extends object
    ? Extract<keyof T, string>
    : string | number

/**
 * Extract value of an object.
 * @param T Object type
 * @param K Key to get value from
 * @returns Value at path.
 */
// @ts-expect-error: ignore
export type Get<T, K> = K extends Key<T> ? T[K] : never

/**
 * Extract nested value of an object.
 * @param T Object type
 * @param P Path to get value from
 * @param N Number of nested keys to explore
 * @returns Value at path.
 */
export type Value<T, P = '', N extends number = 5> =
  // --- If P key of T, return value
  P extends (Key<T> | `${Key<T>}`) ? Get<T, P>

    // --- If recursion threashold, return `any`.
    : N extends 0 ? any

      // --- Extract current segment.
      : P extends `${infer K}.${infer PNext}`

        // --- First segment is key of the object, recurse
        ? K extends (Key<T> | `${Key<T>}`)
          ? Value<Values<T>, PNext, Decrease<N>>
          | Extract<T, undefined>

          // --- Path is invalid
          : never

        // --- Path is invalid
        : never

/**
 * Extract nested paths of an object.
 * @param T Object type
 * @param N Number of nested keys to explore
 * @param P Current path
 * @returns List of possible paths.
 */
export type Path<T, N extends number = 3, P extends string = ''> = Extract<{
  // --- For each keys of T of type `string` or `number`
  [K in keyof NotNil<T>]: K extends string | number

    // --- Add T keys (Handle number keys as string AND numbers)
    ? (P extends '' ? (K | `${K}`) : `${P}${K}`)

    // ---  Check for recursion threshold.
    | (N extends 0 ? `${P}${K}.${string}`

      // --- If value is an object, recurse
      : NotNil<T>[K] extends object
        ? Path<NotNil<T>[K], Decrease<N>, `${P}${K}.`>
        : `${P}${K}.${string}`)

    // --- Ignore symbols
    : never

// --- Extract keys only.s
}[keyof T], string>

/**
 * Map a collection to a new collection.
 * @param T Collection type
 * @param U New value type
 * @returns New collection
 */
export type Mapped<T, U> = { [P in keyof T]: U }
