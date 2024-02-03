/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @returns The collection.
 * @example Collection<number> // { [key: string | symbol]: number } | ...
 */
export type Collection<T = unknown> =
  Record<PropertyKey, T>
  | T[]
  | readonly T[]
  | { [Symbol.iterator](): IterableIterator<T> }

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a collection of numbers', () => {
    type Result = Collection<number>
    type Expected = number[] | Record<PropertyKey, number> | readonly number[] | { [Symbol.iterator](): IterableIterator<number> }
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return a collection of unknowns', () => {
    type Result = Collection
    type Expected = Record<PropertyKey, unknown> | unknown[] | readonly unknown[] | { [Symbol.iterator](): IterableIterator<unknown> }
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
