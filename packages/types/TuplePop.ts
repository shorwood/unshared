import { IsArray } from './utils'

/**
 * Pop the last element of a tuple type. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to pop.
 * @returns The tuple without the last element and the last element.
 * @example TuplePop<[1, 2, 3]> // [[1, 2], 3]
 */
export type TuplePop<T extends unknown[]> =
  IsArray<T> extends true
    ? T extends Array<infer U> ? [T, U] : never
    : T extends [...infer U, infer V] ? [U, V] : [[], undefined]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should pop the last element of a tuple', () => {
    type Result = TuplePop<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<[[1, 2], 3]>()
  })

  it('should pop an empty tuple and return undefined', () => {
    type Result = TuplePop<[]>
    expectTypeOf<Result>().toEqualTypeOf<[[], undefined]>()
  })

  it('should pop a tuple with one element and return an empty tuple', () => {
    type Result = TuplePop<[1]>
    expectTypeOf<Result>().toEqualTypeOf<[[], 1]>()
  })

  it('should pop an array', () => {
    type Result = TuplePop<number[]>
    expectTypeOf<Result>().toEqualTypeOf<[number[], number]>()
  })
}
