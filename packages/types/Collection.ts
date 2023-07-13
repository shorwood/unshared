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
    type Result = Collection<number>
    type Expected = number[] | readonly number[] | Set<number> | Map<string | number | symbol, number> | Record<string | number | symbol, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return an object of numbers keyed by strings', () => {
    type Result = Collection<number, string>
    type Expected = Map<string, number> | Record<string, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return an object of numbers keyed by numbers', () => {
    type Result = Collection<number, number>
    type Matches = number[] | readonly number[] | Set<number> | Map<number, number> | Record<number, number>
    expectTypeOf<Matches>().toEqualTypeOf<Result>()
  })

  it('should return a type that Matches a tuple', () => {
    type Result = Collection<number, number>
    type Matches = [number, number, number]
    expectTypeOf<Matches>().toMatchTypeOf<Result>()
  })

  it('should return a type that Matches a readonly tuple', () => {
    type Result = Collection<number, number>
    type Matches = readonly [number, number, number]
    expectTypeOf<Matches>().toMatchTypeOf<Result>()
  })

  it('should match a type that has literal keys', () => {
    type Result = Collection<number, 'a' | 'b' | 'c'>
    type Expected = Map<'a' | 'b' | 'c', number> | Record<'a' | 'b' | 'c', number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
