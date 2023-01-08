import { createError } from '../misc/createError'
import { HttpStatusCode } from '../network/httpStatusCode'
import { isArray } from '../predicate/isArray'

/**
 * Asserts that the value is an array.
 * @param value The value to check
 * @throws If the value is not an array
 * @example
 * assertArray([]) // OK
 * assertArray({}) // Throws
 */

export const assertArray = (value: unknown): asserts value is unknown[] => {
  if (isArray(value)) return
  throw createError('Expected an array', 'E_NOT_ARRAY', HttpStatusCode.BAD_REQUEST)
}
