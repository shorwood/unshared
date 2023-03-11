/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @template K The type of the keys in the collection.
 * @returns The collection.
 * @example Collection<number> // { [key: string | symbol]: number } | ...
 */
export type Collection<T = unknown, K extends string | number | symbol = string | number | symbol> =
  (K extends number ? T[] | readonly T[] | Set<T> : never) | Map<K, T> | Record<K, T>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a collection of numbers', () => {
    type result = Collection<number>
    type expected = number[] | readonly number[] | Set<number> | Map<string | number | symbol, number> | Record<string | number | symbol, number>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an object of numbers keyed by strings', () => {
    type result = Collection<number, string>
    type expected = Map<string, number> | Record<string, number>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an object of numbers keyed by numbers', () => {
    type result = Collection<number, number>
    type matches = number[] | readonly number[] | Set<number> | Map<number, number> | Record<number, number>
    expectTypeOf<matches>().toEqualTypeOf<result>()
  })

  it('should return a type that matches a tuple', () => {
    type result = Collection<number, number>
    type matches = [number, number, number]
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should return a type that matches a readonly tuple', () => {
    type result = Collection<number, number>
    type matches = readonly [number, number, number]
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should match a type that has literal keys', () => {
    type result = Collection<number, 'a' | 'b' | 'c'>
    type expected = Map<'a' | 'b' | 'c', number> | Record<'a' | 'b' | 'c', number>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
