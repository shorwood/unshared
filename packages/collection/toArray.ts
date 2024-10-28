import type { MaybeArray, Nil } from '@unshared/types'

/**
 * Wrap a value into an array if it is not one already. If the value is
 * `undefined` or `null`, an empty array is returned.
 *
 * @param value The value to wrap.
 * @returns The arrayified value.
 * @example toArray(1) // [1]
 */
export function toArray(value?: Nil): []
export function toArray<U>(value?: MaybeArray<U>): U[]
export function toArray(value?: unknown): unknown[] {

  // --- Return an empty array if the value is undefined or null.
  if (value === undefined || value === null) return []

  // --- Return the array if the value is already an array.
  return Array.isArray(value)
    ? value as unknown[]
    : [value]
}
