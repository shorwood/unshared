/**
 * A type that may be wrapped in an array.
 *
 * @template U The type that may be an in an array.
 * @returns A type that may be an array of `U`.
 * @example MaybeArray<number> // number | number[]
 */
export type MaybeArray<U = unknown> = U | U[]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a type that may be an array of unknown', () => {
    type Result = MaybeArray
    expectTypeOf<Result>().toEqualTypeOf<unknown | unknown[]>()
  })

  it('should return a type that may be an array of U', () => {
    type Result = MaybeArray<number>
    expectTypeOf<Result>().toEqualTypeOf<number | number[]>()
  })

  it('should return a type that may be an array of U when U is an array', () => {
    type Result = MaybeArray<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number[] | number[][]>()
  })
}
