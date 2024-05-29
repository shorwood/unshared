import { assertNumberBetween } from './assertNumberBetween'

/**
 * Create a parser function that can be used to validate a number between a minimum and maximum value.
 *
 * @param min The lower bound of the range.
 * @param max The upper bound of the range.
 * @returns A parser function that can be used to validate a number between a minimum and maximum value.
 * @example const parse = createAssertNumberBetween(1, 10) // (value: unknown) => number
 */
export function createAssertNumberBetween(min: number, max: number) {
  return (value: unknown): asserts value is number => assertNumberBetween(value, min, max)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should pass if value is a number between min and max', () => {
    const result = createAssertNumberBetween(1, 10)(5)
    expect(result).toBeUndefined()
  })

  test('should predicate a number', () => {
    const result = createAssertNumberBetween(1, 10)
    expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is number>()
  })
}
