import { createError } from '@unshared-dev/misc/createError'
import { HttpStatusCode } from '@unshared-dev/network/httpStatusCode'
import { isArray } from '@unshared-dev/predicate/isArray'

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
