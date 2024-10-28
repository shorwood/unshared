import type { Any } from './Any'

/**
 * Matches anything that is not `undefined`. If a generic is provided, it will
 * exclude `undefined` from that type.
 *
 * @template U The type to exclude `undefined` from.
 * @returns A type that excludes `undefined`.
 * @example NotUndefined<number | undefined> // number
 */
export type NotUndefined<U = Any> = U extends undefined ? never : U
