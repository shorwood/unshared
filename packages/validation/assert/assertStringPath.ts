import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'
import { assertStringNotEmpty } from './assertStringNotEmpty'

/**
 * Assert that a value is a string and that it is a valid UNIX path.
 *
 * @param value The value to assert as a valid UNIX path.
 * @throws `AssertionError` if the value is not a valid UNIX path.
 * @example assertStringPath('/home/user/file.txt') // void
 */
export function assertStringPath(value: unknown): asserts value is string {
  assertString(value)
  assertStringNotEmpty(value)

  // Check if it's a valid UNIX path (no invalid characters)
  // UNIX paths can contain most characters except null byte
  if (!value.includes('\0')) return
  throw createAssertionError({
    name: 'E_STRING_NOT_PATH',
    message: 'String is not a valid UNIX path.',
    context: { value },
    schema: { type: 'string', format: 'path' },
  })
}
