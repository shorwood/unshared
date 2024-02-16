import { Collection } from './Collection'

/**
 * Values of an array or object
 *
 * @template T The collection to get the values from
 * @returns The values of the collection
 */
export type Values<T = unknown> =
  T extends string ? string
    : T extends Map<any, infer U> ? U
      : T extends Collection<infer U> ? U
        : unknown

/** v8 ignore start */
if (import.meta.vitest) {
  it('should return the values of an object', () => {
    type Result = Values<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of an array', () => {
    type Result = Values<symbol[]>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should return the values of a tuple', () => {
    type Result = Values<readonly [1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of a readonly array', () => {
    type Result = Values<readonly symbol[]>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should return the values of a set', () => {
    type Result = Values<Set<symbol>>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should return the values of a map', () => {
    type Result = Values<Map<string, symbol>>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  it('should return the values of a string', () => {
    type Result = Values<'abc'>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should fallback to PropertyKey', () => {
    type Result = Values
    expectTypeOf<Result>().toEqualTypeOf<unknown>()
  })
}
