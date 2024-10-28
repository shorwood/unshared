/**
 * Matches a type that is not any.
 *
 * @template T Type to match.
 * @returns The type that is not any.
 * @example
 * // When T is not any, the result is T.
 * NotAny<number> // number
 *
 * // When T is any, the result is never.
 * NotAny<any> // never
 */
export type NotAny<T = unknown> = any extends T ? never : T
