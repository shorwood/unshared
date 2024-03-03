/**
 * Matches a type that is either readonly or not.
 *
 * @template T Type to match.
 * @returns The type that is either readonly or not.
 * @example MaybeReadonly<number> // number | readonly number
 */
export type MaybeReadonly<T = unknown> = Readonly<T> | T

/* v8 ignore next */
if (import.meta.vitest) {
  it('should match a tuple that is either readonly or not', () => {
    type Result = MaybeReadonly<[number, string]>
    expectTypeOf<Result>().toEqualTypeOf<Readonly<[number, string]> | [number, string]>()
  })

  it('should match an object that is either readonly or not', () => {
    type Result = MaybeReadonly<{ a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<Readonly<{ a: number; b: string }> | { a: number; b: string }>()
  })

  it('should match an unknown type by default', () => {
    type Result = MaybeReadonly
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })
}
