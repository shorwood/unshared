import type { MaybeArray } from '@unshared/types'
import { createAssertionError } from '../createAssertionError'
import { assertString } from './assertString'

/**
 * Assert that a value is a string is one of the values in an array.
 *
 * @param values The values to match the value against.
 * @returns A function that asserts a value is a string matching one of the given values.
 * @example assertStringEnum(['Hello, World!', 'Hello, Universe!'])('Hello, World!') // void
 */
export function assertStringEnum<T extends string>(...values: Array<MaybeArray<T>>): (value: unknown) => asserts value is T {
  return (value: unknown): asserts value is T => {
    assertString(value)
    const valuesFlat = values.flat()
    if (valuesFlat.includes(value as T)) return
    const messageValues = valuesFlat.map(x => `'${x}'`).join(', ')
    throw createAssertionError({
      name: 'E_STRING_NOT_ONE_OF_VALUES',
      message: `String is not one of the values: ${messageValues}.`,
      context: { value, values: valuesFlat },
      schema: { type: 'string', enum: valuesFlat },
    })
  }
}
