import type { IsArray } from './utils'

/**
 * Shifts a tuple to the left by one. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to shift.
 * @returns The tuple without the first element and the first element.
 * @example TupleShift<[1, 2, 3]> // [[2, 3], 1]
 */
export type TupleShift<T extends unknown[]> =
  IsArray<T> extends true
    ? T extends (infer U)[] ? [T, U] : never
    : T extends [infer U, ...infer V] ? [V, U] : [[], undefined]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should shift a tuple to the left by one', () => {
    type Result = TupleShift<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<[[2, 3], 1]>()
  })

  it('should shift an empty tuple and return undefined', () => {
    type Result = TupleShift<[]>
    expectTypeOf<Result>().toEqualTypeOf<[[], undefined]>()
  })

  it('should shift a tuple with one element and return an empty tuple', () => {
    type Result = TupleShift<[1]>
    expectTypeOf<Result>().toEqualTypeOf<[[], 1]>()
  })

  it('should shift an array', () => {
    type Result = TupleShift<number[]>
    expectTypeOf<Result>().toEqualTypeOf<[number[], number]>()
  })
}
