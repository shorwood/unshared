import type { NotNil } from '@unshared/types'

/**
 * Filters out `undefined` and `null` values from an array.
 *
 * @param value The array to filter
 * @returns The filtered array
 * @example compact([0, 1, undefined, 2, null, 3]) // => [0, 1, 2, 3]
 */
export function compact<T>(value: T[]): Array<NotNil<T>> {
  return value.filter(x => x !== undefined && x !== null) as Array<NotNil<T>>
}
