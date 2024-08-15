import type { Constructor } from '@unshared/types'
import { assertInstance } from './assertInstance'

/**
 * Create an assertion function that asserts a value is an instance of the given class.
 *
 * @param ctor The class to assert the value is an instance of.
 * @returns An assertion function that asserts a value is an instance of the given class.
 * @example const assertDate = createAssertInstance(Date) // (value: unknown) => asserts value is Date
 */
export function createAssertInstance<T extends object>(ctor: Constructor<T>) {
  return (value: unknown): asserts value is T => assertInstance(value, ctor)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a string ending with the given string', () => {
    const result = createAssertInstance(Date)(new Date())
    expect(result).toBeUndefined()
  })

  test('should predicate a string ending with the given string', () => {
    const result = createAssertInstance(Date)
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is Date>()
  })
}
