/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @returns The collection.
 * @example Collection<number> // Iterable<number> | Record<PropertyKey, number> | readonly number[]
 */
export type Collection<T = unknown> =
  | Iterable<T>
  | Record<PropertyKey, T>
  | readonly T[]

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a collection of numbers', () => {
    type Result = Collection<number>
    type Expected = Iterable<number> | Record<PropertyKey, number> | readonly number[]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a collection of unknowns', () => {
    type Expected = Iterable<unknown> | Record<PropertyKey, unknown> | readonly unknown[]
    expectTypeOf<Collection>().toEqualTypeOf<Expected>()
  })
}
