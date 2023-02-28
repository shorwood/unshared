/**
 * Pop the last element of a tuple type. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to pop.
 * @example TuplePop<[1, 2, 3]> // [1, 2]
 */
export type TuplePop<T extends unknown[]> = T extends [...infer U, any] ? U : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should pop the last element of a tuple', () => {
    type result = TuplePop<[1, 2, 3]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2]>()
  })

  it('should return an empty tuple if the tuple is empty', () => {
    type result = TuplePop<[]>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return an empty tuple if the tuple has one element', () => {
    type result = TuplePop<[1]>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return the same array if an array is passed', () => {
    type result = TuplePop<number[]>
    expectTypeOf<result>().toEqualTypeOf<number[]>()
  })
}
