import { Collection } from './Collection'

/**
 * Values of an array or object
 *
 * @template T The collection to get the values from
 * @returns The values of the collection
 */
export type Values<T> =
  T extends string ? string
    : T extends Collection<infer U> ? U
      : unknown

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the values of an object', () => {
    type Result = Values<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of a readonly object', () => {
    type Result = Values<Readonly<{ a: 1; b: 2; c: 3 }>>
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of a tuple', () => {
    type Result = Values<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of an array', () => {
    type Result = Values<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return the values of a readonly array', () => {
    type Result = Values<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
