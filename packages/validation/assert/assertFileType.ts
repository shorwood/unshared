import { kindOf } from '@unshared/functions'
import { AssertionError, createAssertionError } from '../createAssertionError'
import { createParser, type ParserLike } from '../createParser'
import { assertFile } from './assertFile'

/**
 * Assert that a File has a type that passes a given assertion function.
 *
 * @param rules The assertion function or functions to apply to the file type.
 * @returns A function that asserts a File has a type that passes the assertion.
 * @example assertFileType(assertStringStartingWith('image/'))(new File([''], 'test.jpg', { type: 'image/jpeg' })) // void
 */
export function assertFileType<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is File {
  const parse = createParser(...rules)
  return (value: unknown): asserts value is File => {
    assertFile(value)
    try {
      parse(value.type)
    }
    catch (error) {
      throw createAssertionError({
        name: 'E_FILE_TYPE_NOT_MATCHING',
        message: `File type "${value.type}" does not pass the assertion.`,
        context: { value: value.type, fileName: value.name, received: kindOf(value.type) },
        schema: { type: 'string', pattern: error instanceof AssertionError ? error.schema?.pattern : undefined },
        cause: error,
      })
    }
  }
}
