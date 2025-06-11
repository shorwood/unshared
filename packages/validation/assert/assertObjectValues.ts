import type { ParserLike } from '../createParser'
import { assertObjectOf } from './assertObjectOf'

/**
 * Assert that a value is an object and every property value passes the given assertion functions.
 * Note that this function will not return a new object with parsed values; it will only validate the property values
 * against the provided assertions. If you want to parse the property values as well, consider using {@linkcode assertObjectOf} instead.
 *
 * @param rules The assertion function or functions to apply to every property value in the object.
 * @returns A function that asserts an object's property values match the assertion.
 * @example assertObjectValues(assertString)({ hello: 'world', foo: 'bar' }) // void
 */
export function assertObjectValues<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is Record<PropertyKey, unknown> {
  const parse = assertObjectOf(...rules)
  return (value: unknown) => { parse(value) }
}
