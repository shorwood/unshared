/**
 * Shifts a tuple to the left by one. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to shift.
 * @example TupleShift<[1, 2, 3]> // [2, 3]
 */
export type TupleShift<T extends unknown[]> = T extends [any, ...infer U] ? U : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should shift a tuple to the left by one', () => {
    type result = TupleShift<[1, 2, 3]>
    expectTypeOf<result>().toEqualTypeOf<[2, 3]>()
  })

  it('should return an empty tuple if the tuple is empty', () => {
    type result = TupleShift<[]>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return an empty tuple if the tuple has one element', () => {
    type result = TupleShift<[1]>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return the same array if an array is passed', () => {
    type result = TupleShift<number[]>
    expectTypeOf<result>().toEqualTypeOf<number[]>()
  })
}
