/**
 * Extract the keys of an object.
 *
 * @template T The object to extract the keys from
 * @returns The keys of the object
 */
// TODO: Extract tuple keys as literal numbers
export type Key<T = unknown> =
  T extends string ? (number & keyof T)
    : T extends Map<infer K, any> ? K
      : T extends Iterable<any> ? number
        : T extends object ? keyof T
          : PropertyKey

/** v8 ignore start */
if (import.meta.vitest) {
  it('should return the keys of an object', () => {
    type Result = Key<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<Result>().toEqualTypeOf<'a' | 'b' | 'c'>()
  })

  it('should return the keys of an array', () => {
    type Result = Key<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a tuple', () => {
    type Result = Key<readonly [1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a readonly array', () => {
    type Result = Key<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a set', () => {
    type Result = Key<Set<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a map', () => {
    type Result = Key<Map<string, number>>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should return the keys of a string', () => {
    type Result = Key<'abc'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should fallback to PropertyKey', () => {
    type Result = Key
    expectTypeOf<Result>().toEqualTypeOf<PropertyKey>()
  })
}
