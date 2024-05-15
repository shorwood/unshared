import { Function } from '@unshared/types'

/**
 * Converts a typed assertion function to a predicate function.
 *
 * @template T The type of the assertion function.
 * @returns A function that predicates instead of asserts.
 * @example ToPredicate<(value: unknown) => asserts value is string> // (value: unknown) => value is string
 */
export type ToPredicate<T extends Function> =
  T extends (value: unknown, ...args: infer A) => asserts value is infer U
    ? (value: unknown, ...args: A) => value is U
    : (...args: Parameters<T>) => boolean

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
export function toPredicate<T extends Function>(fn: T): ToPredicate<T> {
  return ((...args: unknown[]) => {
    try {
      fn(...args)
      return true
    }
    catch {
      return false
    }
  }) as ToPredicate<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== 'string') throw new Error('Value is not a string')
  }

  function assertIsLowerThan(value: unknown, max: number): asserts value is number {
    if (typeof value !== 'number') throw new Error('Value is not a number')
    if (value >= max) throw new Error('Value is not lower than max')
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

  test('should pass additional arguments to the assertion function', () => {
    const isLowerThan = toPredicate(assertIsLowerThan)
    const result = isLowerThan(1, 2)
    expect(result).toBe(true)
  })

  test('should return a type predicate', () => {
    const isString = toPredicate(assertIsString)
    expectTypeOf(isString).toEqualTypeOf<(value: unknown) => value is string>()
  })

  test('should return a type predicate with additional arguments', () => {
    const isLowerThan = toPredicate(assertIsLowerThan)
    expectTypeOf(isLowerThan).toEqualTypeOf<(value: unknown, max: number) => value is number>()
  })
}
