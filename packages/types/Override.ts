import type { Pretty } from './Pretty'

/**
 * Override the properties of T with the properties of U and keep the rest.
 *
 * @template T The object to overwrite.
 * @template U The object to overwrite with.
 * @example Override<{ a: string, b: number }, { a: number }> // { a: number, b: number }
 */
export type Override<T, U> = Omit<T, keyof U> & U
