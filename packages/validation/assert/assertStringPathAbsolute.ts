import { createAssertionError } from '../createAssertionError'
import { assertStringPath } from './assertStringPath'

/**
 * Assert that a value is a string and that it is a valid absolute UNIX path.
 *
 * @param value The value to assert as a valid absolute UNIX path.
 * @throws `AssertionError` if the value is not a valid absolute UNIX path.
 * @example assertStringPathAbsolute('/home/user/file.txt') // void
 */
export function assertStringPathAbsolute(value: unknown): asserts value is string {
  assertStringPath(value)
  if (!value.startsWith('/')) {
    throw createAssertionError({
      name: 'E_STRING_NOT_ABSOLUTE_PATH',
      message: 'String is not an absolute UNIX path.',
      context: { value },
      schema: { type: 'string', format: 'absolute-path' },
    })
  }
}
