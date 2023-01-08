import { MaybeArray } from '@unshared-dev/types'

/**
 * Converts a value into an array if it is not one already.
 * @param value The value to convert
 * @return The array
 */
export const arrayify = <T>(value?: MaybeArray<T>): Array<T> => {
  if (typeof value === 'undefined') return []
  if (Array.isArray(value)) return value
  return [value]
}
