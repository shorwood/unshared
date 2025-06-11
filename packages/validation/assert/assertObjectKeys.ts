import { kindOf } from '@unshared/functions'
import { AssertionError, createAssertionError } from '../createAssertionError'
import { createParser, type ParserLike } from '../createParser'
import { assertObject } from './assertObject'

/**
 * Assert that a value is an object and every key passes the given assertion functions.
 *
 * @param rules The assertion function or functions to apply to every key in the object.
 * @returns A function that asserts an object's keys match the assertion.
 * @example assertObjectKeys(assertString)({ hello: 'world' }) // void
 */
export function assertObjectKeys<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is Record<PropertyKey, unknown> {
  const parse = createParser(...rules)
  return (value: unknown): asserts value is Record<PropertyKey, unknown> => {
    assertObject(value)
    try {
      for (const key of Object.keys(value))
        parse(key)
    }
    catch (error) {
      throw createAssertionError({
        name: 'E_OBJECT_KEYS',
        message: 'Object keys do not pass the assertion.',
        context: { value, received: kindOf(value) },
        schema: { type: 'object', propertyNames: error instanceof AssertionError ? error.schema : undefined },
        cause: error,
      })
    }
  }
}
