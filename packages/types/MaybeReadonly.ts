/**
 * Matches a type that is either readonly or not.
 *
 * @template T Type to match.
 * @returns The type that is either readonly or not.
 * @example MaybeReadonly<number> // number | readonly number
 */
export type MaybeReadonly<T = unknown> = Readonly<T> | T
