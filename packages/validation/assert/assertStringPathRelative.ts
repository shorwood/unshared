import { createAssertionError } from '../createAssertionError'
import { assertStringPath } from './assertStringPath'

/**
 * Assert that a value is a string and that it is a valid relative UNIX path.
 *
 * @param value The value to assert as a valid relative UNIX path.
 * @throws `AssertionError` if the value is not a valid relative UNIX path.
 * @example assertStringPathRelative('relative/path/file.txt') // void
 */
export function assertStringPathRelative(value: unknown): asserts value is string {
  assertStringPath(value)
  if (!value.startsWith('/')) return
  throw createAssertionError({
    name: 'E_STRING_NOT_RELATIVE_PATH',
    message: 'String is not a relative UNIX path.',
    context: { value },
    schema: { type: 'string', format: 'relative-path' },
  })
}
