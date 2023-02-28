/**
 * Concatenate two tuples together. This is a type-level equivalent of the
 * `concat` method on arrays.
 *
 * @template T1 The first tuple.
 * @template T2 The second tuple.
 * @returns The concatenated tuple.
 * @example TupleConcat<[1, 2], [3, 4]> // [1, 2, 3, 4]
 */
export type TupleConcat<T1 extends unknown[], T2 extends unknown[]> =
  T1 extends [...infer U1] ? T2 extends [...infer U2] ? [...U1, ...U2]
    : T1 : T2

/** c8 ignore next */
if (import.meta.vitest) {
  it('should concatenate two tuples together', () => {
    type result = TupleConcat<[1, 2], [3, 4]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2, 3, 4]>()
  })

  it('should return the second tuple if the first tuple is empty', () => {
    type result = TupleConcat<[], [1, 2]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2]>()
  })

  it('should return the first tuple if the second tuple is empty', () => {
    type result = TupleConcat<[1, 2], []>
    expectTypeOf<result>().toEqualTypeOf<[1, 2]>()
  })

  it('should return an empty tuple if both tuples are empty', () => {
    type result = TupleConcat<[], []>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return the same array if an array is passed', () => {
    type result = TupleConcat<number[], number[]>
    expectTypeOf<result>().toEqualTypeOf<number[]>()
  })
}
