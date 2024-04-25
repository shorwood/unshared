/**
 * Get the length of a tuple
 *
 * @template T Tuple
 * @returns Length of tuple
 * @example TupleLength<[1, 2, 3]> // 3
 */
export type TupleLength<T extends unknown[]> =
  T extends { length: infer L extends number } ? L : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should get the length of a tuple of length 3', () => {
    type Result = TupleLength<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<3>()
  })

  test('should get the length of a tuple of length 0', () => {
    type Result = TupleLength<[]>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number when passing an array', () => {
    type Result = TupleLength<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
