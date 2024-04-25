/**
 * Replace all instances of a type union with another type.
 *
 * @template T The type union to replace types in.
 * @template U The replaced type.
 * @template V The replacement type.
 */
export type Replace<T, U, V> = U extends T ? T extends U ? V : T : T

/** v8 ignore start */
if (import.meta.vitest) {
  test('should replace string with number', () => {
    type Result = Replace<boolean | string, string, number>
    expectTypeOf<Result>().toEqualTypeOf<boolean | number>()
  })

  test('should replace undefined with null', () => {
    type Result = Replace<boolean | undefined, undefined, null>
    expectTypeOf<Result>().toEqualTypeOf<boolean | null>()
  })

  test('should replace empty tuple with string', () => {
    type Result = Replace<[] | boolean, [], string>
    expectTypeOf<Result>().toEqualTypeOf<boolean | string>()
  })
}
