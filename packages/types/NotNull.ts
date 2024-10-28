/**
 * Matches anything that is not `null`. If a generic is provided, it will
 * exclude `null` from that type.
 *
 * @template U The type to exclude `null` from.
 * @returns A type that excludes `null`.
 * @example NotNull<number | null> // number
 */
export type NotNull<U = unknown> = U extends null ? never : U
