import type { ParserLike, ParserResult } from './createParser'
import { assertArray } from './assert/assertArray'
import { createParser } from './createParser'
import { ValidationError } from './createValidationError'

/** A parser function that can be used to validate an array of values. */
export type ArrayParser<T extends ParserLike> =
  (value: unknown) => Array<ParserResult<T>>

/**
 * Create a parser function that can be used to validate an array of values.
 *
 * @param rules The rules or schema to use to validate the array.
 * @returns A parser function that can be used to validate an array of values.
 * @example
 * // Create a parser function from a schema.
 * const parse = createArrayParser([String])
 *
 * // Parse the value.
 * const result = parse(['Hello, World!']) // ['Hello, World!']
 */
export function createArrayParser<T extends ParserLike>(...rules: T): ArrayParser<T> {
  const parse = createParser(...rules)

  return (array: unknown) => {
    assertArray(array)
    let index = 0
    const result = []
    const errors: Record<number, Error> = {}

    // --- For each value in the array, parse the value. If the value passes
    // --- validation, push the value to the result array. If the value fails
    // --- validation, store the error in the errors object.
    for (const value of array) {
      try { result.push(parse(value)) }
      catch (error) { errors[index] = error as Error }
      index++
    }

    // --- If there are errors, throw a validation error.
    if (Object.keys(errors).length > 0) {
      throw new ValidationError({
        name: 'E_ARRAY_MISMATCH',
        message: 'One or more values did not pass validation.',
        context: errors,
      })
    }

    return result
  }
}
