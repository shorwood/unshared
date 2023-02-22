/**
 * Extract the keys of an object.
 *
 * @template T The object to extract the keys from
 * @returns The keys of the object
 */
export type Key<T = any> =
  // --- If iterable, return number
  T extends string | any[] | readonly any[] ? Extract<keyof T, number>

    // --- If object, return string
    : T extends object ? keyof T

      // --- Else, return string | number
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the keys of an object', () => {
    type result = Key<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<result>().toEqualTypeOf<'a' | 'b' | 'c'>()
  })

  it('should return the keys of an array', () => {
    type result = Key<[1, 2, 3]>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a readonly array', () => {
    type result = Key<readonly number[]>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return the keys of a string', () => {
    type result = Key<'abc'>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return never when given a number', () => {
    type result = Key<number>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return never when given a boolean', () => {
    type result = Key<boolean>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
