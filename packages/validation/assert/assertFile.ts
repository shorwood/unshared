import { kindOf } from '@unshared/functions'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is a File object.
 *
 * @param value The value to assert as a File.
 * @throws `AssertionError` if the value is not a File.
 * @example assertFile(new File([''], 'test.txt')) // void
 */
export function assertFile(value: unknown): asserts value is File {
  if (value instanceof File) return
  throw createAssertionError({
    name: 'E_NOT_FILE',
    message: 'Value is not a File.',
    context: { value, received: kindOf(value) },
    schema: { type: 'object' },
  })
}
