import type { Nil } from './Nil'

/**
 * Matches anything that is not `null`, `undefined` or `void`. If a generic is
 * provided, it will exclude `null`, `undefined` and `void` from that type.
 *
 * @template U The type to exclude `null`, `undefined` and `void` from.
 * @returns A type that excludes `null`, `undefined` and `void`.
 * @example NotNil<number | undefined> // number
 */
export type NotNil<U = unknown> = U extends Nil ? never : U
