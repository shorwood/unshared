/**
 * Extract the keys of an object.
 *
 * @template T The object to extract the keys from
 * @returns The keys of the object
 */
// TODO: Extract tuple keys as literal numbers
export type Key<T> =
  T extends string ? (keyof T & number)
    : T extends readonly unknown[] ? (keyof T & number)
      : T extends object ? keyof T
        : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the keys of an object', () => {
    type Result = Key<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<Result>().toEqualTypeOf<'a' | 'b' | 'c'>()
  })

  it('should return the keys of an array', () => {
    type Result = Key<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a readonly array', () => {
    type Result = Key<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a string', () => {
    type Result = Key<'abc'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return never when given a number', () => {
    type Result = Key<number>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should return never when given a boolean', () => {
    type Result = Key<boolean>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
