/**
 * Get the length of a tuple
 *
 * @template T Tuple
 * @returns Length of tuple
 * @example TupleLength<[1, 2, 3]> // 3
 */
export type TupleLength<T extends unknown[]> =
  T extends { length: infer L extends number } ? L : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the length of a tuple of length 3', () => {
    type result = TupleLength<[1, 2, 3]>
    expectTypeOf<result>().toEqualTypeOf<3>()
  })

  it('should get the length of a tuple of length 0', () => {
    type result = TupleLength<[]>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number when passing an array', () => {
    type result = TupleLength<number[]>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
