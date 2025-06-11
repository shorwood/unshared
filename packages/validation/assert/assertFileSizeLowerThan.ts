import { createAssertionError } from '../createAssertionError'
import { assertFile } from './assertFile'

/**
 * Assert that a File has a size lower than a maximum value.
 *
 * @param maximum The maximum size in bytes the file must be lower than.
 * @returns A function that asserts a File size is lower than the given maximum.
 * @example assertFileSizeLowerThan(1024)(new File([''], 'test.txt')) // void
 */
export function assertFileSizeLowerThan(maximum: number): (value: unknown) => asserts value is File {
  return (value: unknown): asserts value is File => {
    assertFile(value)
    if (value.size < maximum) return
    throw createAssertionError({
      name: 'E_FILE_SIZE_NOT_LOWER_THAN',
      message: `File size of ${value.name} (${value.size} bytes) is not lower than ${maximum} bytes.`,
      context: { value: value.size, maximum, name: value.name },
      schema: { type: 'number', exclusiveMaximum: maximum },
    })
  }
}
