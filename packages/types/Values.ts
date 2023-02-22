import { Collection } from './Collection'

/**
 * Values of an array or object
 *
 * @template T The collection to get the values from
 * @returns The values of the collection
 */
export type Values<T = unknown> = T extends Collection<infer U> ? U : unknown

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the values of an array', () => {
    type result = Values<[1, 2, 3]>
    expectTypeOf<result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of an object', () => {
    type result = Values<{ a: 1; b: 2; c: 3 }>
    expectTypeOf<result>().toEqualTypeOf<1 | 2 | 3>()
  })

  it('should return the values of a generator', () => {
    type result = Values<Generator<number>>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return the values of an iterator', () => {
    type result = Values<{ [Symbol.iterator](): Iterator<number> }>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return the values of a readonly array', () => {
    type result = Values<readonly number[]>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
