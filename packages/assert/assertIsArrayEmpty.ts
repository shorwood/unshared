import { createError } from '@unshared/misc/createError'
import { HttpStatusCode } from '@unshared/network/httpStatusCode'
import { isArrayEmpty } from '@unshared/predicate/isArrayEmpty'

/**
 * Asserts that the value is an empty array.
 *
 * @param value The value to check
 * @throws If the value is not an empty array
 * @example
 * assertArrayEmpty([]) // OK
 * assertArrayEmpty([1, 2, 3]) // Throws
 */

export const assertArrayEmpty = (value: unknown[]): asserts value is [] => {
  if (isArrayEmpty(value) === false)
    throw createError('Expected an empty array', 'E_NOT_EMPTY_ARRAY', HttpStatusCode.BAD_REQUEST)
}
