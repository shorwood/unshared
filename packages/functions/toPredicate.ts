import { Assertor } from '@unshared/types'
import { Predicator } from '@unshared/types'

/**
 * Given a typed assertion function, returns a predicate function
 * that can be used to infer the type of the value without the need
 * to catch the error.
 *
 * @param fn The assertion function to convert to a predicate.
 * @returns A predicate function that returns `true` if the value passes the assertion, `false` otherwise.
 * @example
 * // Declare a type assertion function.
 * function assertIsString(value: unknown): asserts value is string {
 *   if (typeof value !== 'string') throw new Error('Value is not a string')
 * }
 *
 * // Convert the assertion function to a predicate.
 * const isString = toPredicate(assertIsString) // (value: unknown) => value is string
 */
export function toPredicate<T>(fn: Assertor<T>): Predicator<T> {
  return (value: unknown): value is T => {
    try {
      fn(value)
      return true
    }
    catch {
      return false
    }
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== 'string') throw new Error('Value is not a string')
  }

  test('should return true if value is a string', () => {
    const isString = toPredicate(assertIsString)
    const result = isString('hello')
    expect(result).toBe(true)
  })

  test('should return false if value is not a string', () => {
    const isString = toPredicate(assertIsString)
    const result = isString(1)
    expect(result).toBe(false)
  })
}
