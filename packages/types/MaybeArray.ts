/**
 * A type that may be wrapped in an array.
 *
 * @template U The type that may be an in an array.
 * @returns A type that may be an array of `U`.
 * @example MaybeArray<number> // number | number[]
 */
export type MaybeArray<U = unknown> = U | U[]

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a type that may be an array of unknown', () => {
    type Result = MaybeArray
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })

  test('should return a type that may be an array of U', () => {
    type Result = MaybeArray<number>
    expectTypeOf<Result>().toEqualTypeOf<number | number[]>()
  })

  test('should return a type that may be an array of U when U is an array', () => {
    type Result = MaybeArray<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number[] | number[][]>()
  })
}
