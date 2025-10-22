import type { ParserLike, ParserResult } from '../createParser'
// oxlint-disable-next-line @typescript-eslint/no-unused-vars
import type { assertObjectValues } from './assertObjectValues'
import { createAssertionError } from '../createAssertionError'
import { createParser } from '../createParser'
import { assertObject } from './assertObject'

/**
 * Create a parser function that can be used to validate an object's property values. Note
 * that this function will return a new object with the parsed values. If you only want to
 * validate the object without parsing it, consider using {@linkcode assertObjectValues} instead.
 *
 * @param rules The rules or schema to use to validate the object property values.
 * @returns A parser function that can be used to validate an object's property values.
 * @example
 * // Create a parser function from a schema.
 * const parse = assertObjectOf(assertString)
 *
 * // Parse the value.
 * const result = parse({ hello: 'world', foo: 'bar' }) // { hello: 'world', foo: 'bar' }
 */
export function assertObjectOf<T extends ParserLike>(...rules: T): (value: unknown) => Record<PropertyKey, ParserResult<T>> {
  const parse = createParser(...rules)
  return (object: unknown) => {
    assertObject(object)
    const result: Record<PropertyKey, ParserResult<T>> = {}
    const errors: Record<PropertyKey, Error> = {}

    // --- For each property in the object, parse its value. If the value passes
    // --- validation, add the value to the result object. If the value fails
    // --- validation, store the error in the errors object.
    for (const [key, value] of Object.entries(object)) {
      try { result[key] = (parse(value) ?? value) as ParserResult<T> }
      catch (error) { errors[key] = error as Error }
    }

    // --- Check if there are any errors and throw them.
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      throw createAssertionError({
        name: 'E_OBJECT_VALUES_ASSERTION_FAILED',
        message: `Object properties [${keys.join(', ')}] did not match the assertion rules.`,
        context: { keys, errors },
      })
    }

    return result
  }
}
