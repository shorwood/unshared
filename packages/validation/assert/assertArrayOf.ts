import type { ParserLike, ParserResult } from '../createParser'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { assertArrayItems } from './assertArrayItems'
import { createAssertionError } from '../createAssertionError'
import { createParser } from '../createParser'
import { assertArray } from './assertArray'

/**
 * Create a parser function that can be used to assert and parse an array of values
 * against a set of rules or schema. Note that this function will return a new array
 * with the parsed values. If you only want to validate the array without parsing it,
 * consider using {@linkcode assertArrayItems} instead.
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
export function assertArrayOf<T extends ParserLike>(...rules: T): (value: unknown) => Array<ParserResult<T>> {
  const parse = createParser(...rules)
  return (array: unknown) => {
    assertArray(array)
    let index = 0
    const result = []
    const errors: Record<number, Error> = {}

    // --- For each item in the array, parse it's value. If the value passes
    // --- validation, push the value to the result array. If the value fails
    // --- validation, store the error in the errors object.
    for (const value of array) {
      try { result.push(parse(value) ?? value) }
      catch (error) { errors[index] = error as Error }
      index++
    }

    // --- Check if there are any errors and throw them.
    const indices = Object.keys(errors)
    if (indices.length > 0) {
      throw createAssertionError({
        name: 'E_ARRAY_ITEMS_ASSERTION_FAILED',
        message: `Items at indices [${indices.join(', ')}] did match the assertion rules.`,
        context: { indices: indices.map(Number), errors },
      })
    }

    return result as Array<ParserResult<T>>
  }
}
