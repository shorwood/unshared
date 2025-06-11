import type { Constructor } from '@unshared/types'
import { kindOf } from '@unshared/functions/kindOf'
import { createAssertionError } from '../createAssertionError'

/**
 * Assert that a value is an instance of the given class.
 *
 * @param ctor The class to assert the value is an instance of.
 * @returns A function that asserts a value is an instance of the given class.
 * @example assertInstanceOf(Date) // (value: unknown) => asserts value is Date
 */
export function assertInstanceOf<T extends object>(ctor: Constructor<T>): (value: unknown) => asserts value is T {
  return (value: unknown) => {
    if (value instanceof ctor) return
    const expected = ctor.name || 'Unknown'
    throw createAssertionError({
      name: 'E_NOT_INSTANCE_OF',
      message: `Value is not an instance of "${expected}"`,
      context: { expected, received: kindOf(value), ctor },
    })
  }
}
