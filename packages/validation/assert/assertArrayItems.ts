import type { ParserLike, ParserResult } from '../createParser'
import { assertArrayOf } from './assertArrayOf'

/**
 * Assert that a value is an array and every item passes the given assertion functions.
 * Note that this function will not return a new array with parsed values; it will only validate the items
 * against the provided assertions. If you want to parse the items as well, consider using {@linkcode assertArrayOf} instead.
 *
 * @param rules The assertion function or functions to apply to every item in the array.
 * @returns A function that asserts an array's items match the assertion.
 * @example assertArrayItems(assertString)(['hello', 'world']) // void
 */
export function assertArrayItems<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is Array<ParserResult<T>> {
  const parse = assertArrayOf(...rules)
  return (value: unknown) => { parse(value) }
}
