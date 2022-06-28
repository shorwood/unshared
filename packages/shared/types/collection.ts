import { Decrease } from './arithmetic'
import { NotNil } from './common'

/** Types allowed for object keys. */
export type Key = string | number

/** Collection of items in the form of an object or an array. */
export type Collection<U, K extends string | number = any> = K extends number
  ? Array<U>
  : { [P in K]: U }

/** Values of an array or object */
export type Values<T = object> = T extends string | any[]
  ? T[number]
  : T extends object
    ? T[keyof T]
    : never

/** Keys of an array or object */
export type Keys<T> = T extends string | any[]
  ? Extract<keyof T, number>
  : T extends object
    ? Exclude<keyof T, symbol>
    : never

/** Nested values of an object */
export type Value<T, P = ''> =
  // --- Is key, return value
  P extends keyof T
    ? T[P]

  // --- Is path, list of segments
    : P extends `${infer K}.${infer PNext}`

    // --- First segment is key of the object, recurse
      ? K extends keyof T
        ? Value<T[K], PNext>
        : Value<NotNil<T>, P> | undefined

      // --- Path might be undefined
      : Value<NotNil<T>, P> | undefined

/**
 * Extract nested paths of an object.
 * @param T - Object type
 * @param N - Number of nested keys to explore
 * @param P - Current path
 * @returns List of possible paths.
 */
export type Path<T, N extends number = 3, P extends string = ''> = Extract<{
  // --- For each keys of T of type `string` or `number`
  [K in keyof T]: K extends string | number

    // --- If value is any, return `foo.${string}`
    ? N extends 0
      ? `${P}${K}` | `${P}${K}.${string}`

      // --- If value is an object
      : NotNil<T[K]> extends object
        ? `${P}${K}` | Path<NotNil<T[K]>, Decrease<N>, `${P}${K}.`>
        : `${P}${K}` | `${P}${K}.${string}`

    // --- Ignore symbols
    : never

// --- Extract keys only.s
}[keyof T], string>
