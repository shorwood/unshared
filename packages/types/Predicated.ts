/**
 * Infer the predicate type from a predicator or assertor function.
 *
 * @template T The predicator function.
 * @example Predicated<(value: unknown) => value is string> // string
 */
export type Predicated<T> =
  T extends (value: any, ...args: any[]) => value is infer R
    ? (unknown extends R ? never : R)
    : never

/** v8 ignore start */
if (import.meta.vitest) {
  test('should give string from a predicator of strings', () => {
    type Result = Predicated<(value: unknown) => value is string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should give never from an assertor of numbers', () => {
    type Result = Predicated<(value: unknown) => asserts value is number>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should give unknown from a predicator for unknowns', () => {
    type Result = Predicated<(value: unknown) => value is unknown>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should give unknown for non-predicator functions', () => {
    type Result = Predicated<(value: unknown) => boolean>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match predicator with more than one parameter', () => {
    type Result = Predicated<(value: unknown, key: string) => value is string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
}
