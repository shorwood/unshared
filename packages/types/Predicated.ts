/**
 * Infer the predicate type from a predicator function.
 *
 * @template T The predicator function.
 * @example Predicated<(value: unknown) => value is string> // string
 */
export type Predicated<T> = T extends (value: any, ...args: any[]) => value is infer R ? R : never

/** v8 ignore start */
if (import.meta.vitest) {
  it('should infer string from a predicator for strings', () => {
    type Result = Predicated<(value: unknown) => value is string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should infer number from a predicator for numbers', () => {
    type Result = Predicated<(value: unknown) => value is number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should infer unknown from a predicator for unknowns', () => {
    type Result = Predicated<(value: unknown) => value is unknown>
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })

  it('should give never for non-predicator functions', () => {
    type Result = Predicated<(value: unknown) => boolean>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match function with more than one parameter', () => {
    type Result = Predicated<(value: unknown, key: string) => value is string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
}
