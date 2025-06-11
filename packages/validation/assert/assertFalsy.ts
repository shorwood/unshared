import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is falsy. Meaning it is either `false`, `0`, `''`, `null` or `undefined`.
 *
 * @param value The value to assert as falsy.
 * @throws `AssertionError` if the value is not falsy.
 * @example assertFalsy(false) // void
 */
export function assertFalsy(value: unknown): asserts value is 0 | '' | false | null | undefined {
  if (!value) return
  throw createAssertionError({
    name: 'E_NOT_FALSY',
    message: 'Value is not falsy.',
    context: { value, received: kindOf(value) },
    schema: {
      oneOf: [
        { type: 'boolean', const: false },
        { type: 'number', const: 0 },
        { type: 'string', const: '' },
        { type: 'null' },
      ],
    },
  })
}
