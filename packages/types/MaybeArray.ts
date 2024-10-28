/**
 * A type that may be wrapped in an array.
 *
 * @template U The type that may be an in an array.
 * @returns A type that may be an array of `U`.
 * @example MaybeArray<number> // number | number[]
 */
export type MaybeArray<U = unknown> = U | U[]
