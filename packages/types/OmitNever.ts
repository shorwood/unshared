import type { Pretty } from './Pretty'

/**
 * Omit properties with value of `never` from the object.
 *
 * @template T The object to omit properties from.
 * @example type Result = OmitNever<{ a: string; b: never; c: number }> // { a: string; c: number }
 */
export type OmitNever<T> =
  Pretty<{ [K in keyof T as T[K] extends never ? never : K]: T[K] }>
