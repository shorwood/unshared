import type { OmitNever } from './OmitNever'
import type { UnionMerge } from './UnionMerge'

/**
 * Override the properties of T with the properties of U and keep the rest.
 *
 * @template T The object to overwrite.
 * @template U The object to overwrite with.
 * @example Override<{ a: string, b: number }, { a: number }> // { a: number, b: number }
 */
export type Override<T, U> = UnionMerge<Omit<T, keyof OmitNever<U>> | OmitNever<U>>
