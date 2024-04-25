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
  test('should match a tuple that is either readonly or not', () => {
    type Result = MaybeReadonly<[number, string]>
    expectTypeOf<Result>().toEqualTypeOf<[number, string] | Readonly<[number, string]>>()
  })

  test('should match an object that is either readonly or not', () => {
    type Result = MaybeReadonly<{ a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string } | Readonly<{ a: number; b: string }>>()
  })

  test('should match an unknown type by default', () => {
    type Result = MaybeReadonly
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })
}
