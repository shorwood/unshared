/**
 * A result type that can be used to represent the result of an operation that
 * can fail. This type is similar to the `Either` type in functional programming
 * languages.
 *
 * @template T The type of the value.
 * @template E The type of the error.
 * @example Result<string, Error> // [string | undefined, Error | undefined]
 */
export type Result<T = unknown, E extends Error = Error> = [T | undefined, E | undefined]
