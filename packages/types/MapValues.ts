/**
 * Map the properties of a collection to a new value type.
 *
 * @template T Type of the collection.
 * @template U Type to map the properties to.
 * @returns A collection with the same keys but the new properties type.
 * @example MapValues<{ foo: string }, number> // { foo: number }
 */
export type MapValues<T extends object, U> =
  T extends object ? { [P in keyof T]: U } : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should map the values of an object', () => {
    type Result = MapValues<{ foo: string }, number>
    expectTypeOf<Result>().toEqualTypeOf<{ foo: number }>()
  })

  test('should map the values of an array', () => {
    type Result = MapValues<string[], number>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  test('should map the values of a tuple', () => {
    type Result = MapValues<[string, string], number>
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>()
  })
}
