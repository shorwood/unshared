/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @returns The collection.
 * @example Collection<number> // { [key: string | symbol]: number } | ...
 */
export type Collection<T = unknown> =
  T[] | readonly T[] | Record<string | number | symbol, T>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a collection of numbers', () => {
    type Result = Collection<number>
    type Expected = number[] | readonly number[] | Record<string | number | symbol, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return a collection of unknowns', () => {
    type Result = Collection
    type Expected = unknown[] | readonly unknown[] | Record<string | number | symbol, unknown>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
