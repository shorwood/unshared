import { createAssertionError } from '../createAssertionError'
import { assertFile } from './assertFile'

/**
 * Assert that a File has a size between a minimum and maximum value.
 *
 * @param minimum The minimum size in bytes the file must be.
 * @param maximum The maximum size in bytes the file must be.
 * @returns A function that asserts a File size is within the given range.
 * @example assertFileSizeInRange(100, 1024)(new File(['content'], 'test.txt')) // void
 */
export function assertFileSizeInRange(minimum: number, maximum: number): (value: unknown) => asserts value is File {
  return (value: unknown): asserts value is File => {
    assertFile(value)
    if (value.size >= minimum && value.size <= maximum) return
    throw createAssertionError({
      name: 'E_FILE_SIZE_OUT_OF_RANGE',
      message: `File size of ${value.name} (${value.size} bytes) is not between ${minimum} and ${maximum} bytes.`,
      context: { value: value.size, min: minimum, max: maximum, name: value.name },
      schema: { type: 'number', minimum, maximum },
    })
  }
}
