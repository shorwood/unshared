import { kindOf } from '@unshared/functions'
import { AssertionError, createAssertionError } from '../createAssertionError'
import { createParser, type ParserLike } from '../createParser'
import { assertFile } from './assertFile'

/**
 * Assert that a File has a name that passes a given assertion function.
 *
 * @param rules The assertion function or functions to apply to the File's name.
 * @returns A function that asserts a File has a name that passes the assertion.
 * @example assertFileName(assertStringStartingWith('image'))( new File([''], 'image.jpg')) // void
 */
export function assertFileName<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is File {
  const fn = createParser(...rules)
  return (value: unknown): asserts value is File => {
    assertFile(value)
    try {
      fn(value.name)
    }
    catch (error) {
      throw createAssertionError({
        name: 'E_FILE_NAME_NOT_MATCHING',
        message: `File name "${value.name}" does not pass the assertion.`,
        context: { value: value.name, received: kindOf(value.name) },
        schema: { type: 'string', pattern: error instanceof AssertionError ? error.schema?.pattern : undefined },
        cause: error,
      })
    }
  }
}
