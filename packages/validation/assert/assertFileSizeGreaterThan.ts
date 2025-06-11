import { createAssertionError } from '../createAssertionError'
import { assertFile } from './assertFile'

/**
 * Assert that a File has a size greater than a minimum value.
 *
 * @param minimum The minimum size in bytes the file must be greater than.
 * @returns A function that asserts a File size is greater than the given minimum.
 * @example assertFileSizeGreaterThan(100)(new File(['content'], 'test.txt')) // void
 */
export function assertFileSizeGreaterThan(minimum: number): (value: unknown) => asserts value is File {
  return (value: unknown): asserts value is File => {
    assertFile(value)
    if (value.size > minimum) return
    throw createAssertionError({
      name: 'E_FILE_SIZE_NOT_GREATER_THAN',
      message: `File size of ${value.name} (${value.size} bytes) is not greater than ${minimum} bytes.`,
      context: { value: value.size, minimum, name: value.name },
      schema: { type: 'number', exclusiveMinimum: minimum },
    })
  }
}
