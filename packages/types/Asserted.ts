/**
 * Infer the asserted type from an assertor function.
 *
 * @template T The assertor function.
 * @example Asserted<(value: unknown) => asserts value is string> // string
 */
export type Asserted<T> =
   T extends (value: any, ...args: any[]) => asserts value is infer R
     ? unknown extends R ? never : R
     : never

/** v8 ignore start */
if (import.meta.vitest) {
  test('should give never from a predicator of strings', () => {
    type Result = Asserted<(value: unknown) => value is string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should give unknown from an assertor of numbers', () => {
    type Result = Asserted<(value: unknown) => asserts value is number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should give never from a predicator for unknowns', () => {
    type Result = Asserted<(value: unknown) => value is unknown>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should give never for non-predicator functions', () => {
    type Result = Asserted<(value: unknown) => boolean>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match assertor with more than one parameter', () => {
    type Result = Asserted<(value: unknown, key: string) => asserts value is string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
}
