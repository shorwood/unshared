import { kindOf } from '@unshared/functions'
import { AssertionError, createAssertionError } from '../createAssertionError'
import { createParser, type ParserLike } from '../createParser'
import { assertFile } from './assertFile'

/**
 * Assert that a File has an extension that passes a given assertion function.
 *
 * @param rules The assertion function or functions to apply to the file extension.
 * @returns A function that asserts a File has an extension that passes the assertion.
 * @example assertFileExtension(assertStringEquals('.jpg'))(new File([''], 'image.jpg')) // void
 */
export function assertFileExtension<T extends ParserLike>(...rules: T): (value: unknown) => asserts value is File {
  const parse = createParser(...rules)
  return (value: unknown): asserts value is File => {
    assertFile(value)
    const lastDotIndex = value.name.lastIndexOf('.')
    const extension = lastDotIndex === -1 ? '' : value.name.slice(lastDotIndex)
    try {
      parse(extension)
    }
    catch (error) {
      throw createAssertionError({
        name: 'E_FILE_EXTENSION_NOT_MATCHING',
        message: `File extension "${extension}" does not pass the assertion.`,
        context: { value: extension, fileName: value.name, received: kindOf(extension) },
        schema: { type: 'string', pattern: error instanceof AssertionError ? error.schema?.pattern : undefined },
        cause: error,
      })
    }
  }
}
