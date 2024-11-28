import type { Any } from './Any'
import type { IsUnknown } from './utils'

/**
 * Matches anything that is not a function. If a generic is provided, it will
 * exclude functions from that type.
 *
 * @template T The type to exclude functions from.
 * @returns A type that excludes functions.
 * @example NotFunction & Function // never
 */
export type NotFunction<T = unknown> =
  IsUnknown<T> extends true
    ? Any & { apply?: never }
    : T extends (...args: any[]) => any ? never : T
