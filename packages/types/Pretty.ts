import type { Function } from './Function'

/**
 * Unwrap the type making it easier to read in the IDE. This type is useful when
 * working with deeply nested types that produce implicit signatures that are
 * hard to read and understand.
 *
 * @template T The type to wrap.
 * @example
 *
 * // Create a type that deeply modifies the keys of an object.
 * type UppercaseKeys<T extends object> = {
 *   [K in keyof T as Uppercase<K & string>]:
 *     T[K] extends object ? UppercaseKeys<T[K]> : T[K]
 * }
 *
 * // Create a type that is not unwrapped in the IDE.
 * // Notice how the `FLAGS` property is not expanded.
 * type Input = UppercaseKeys<{ name: 'JOHN'; flags: { isAdmin: true } }>
 * // { NAME: 'JOHN'; FLAGS: UppercaseKeys<{ isAdmin: true }> }
 *
 * // Wrap the type in a `Pretty` type to declutter the type signature.
 * // The `FLAGS` property is now expanded and easier to read.
 * type Output = Pretty<Input>
 * // { NAME: 'JOHN'; FLAGS: { ISADMIN: true } }
 */
export type Pretty<T> =
  T extends Function ? T
    : T extends Array<infer U> ? Array<Pretty<U>>
      : T extends Record<string, unknown> ? { [K in keyof T]: Pretty<T[K]> }
        : T
