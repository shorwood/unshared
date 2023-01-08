import { createError } from '../misc/createError'
import { HttpStatusCode } from '../network/httpStatusCode'
import { isArrayEmpty } from '../predicate/isArrayEmpty'

/**
 * Asserts that the value is an empty array.
 * @param value The value to check
 * @throws If the value is not an empty array
 * @example
 * assertArrayEmpty([]) // OK
 * assertArrayEmpty([1, 2, 3]) // Throws
 */

export const assertArrayEmpty = (value: unknown[]): asserts value is [] => {
  if (isArrayEmpty(value)) return
  throw createError('Expected an empty array', 'E_NOT_EMPTY_ARRAY', HttpStatusCode.BAD_REQUEST)
}
