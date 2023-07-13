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
    type Result = TupleConcat<[1, 2], [3, 4]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3, 4]>()
  })

  it('should return the second tuple if the first tuple is empty', () => {
    type Result = TupleConcat<[], [1, 2]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2]>()
  })

  it('should return the first tuple if the second tuple is empty', () => {
    type Result = TupleConcat<[1, 2], []>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2]>()
  })

  it('should return an empty tuple if both tuples are empty', () => {
    type Result = TupleConcat<[], []>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  it('should return the same array if an array is passed', () => {
    type Result = TupleConcat<number[], number[]>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  it('should return a tuple with rest parameters at the end', () => {
    type Result = TupleConcat<[1, 2], number[]>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, ...number[]]>()
  })

  it('should return a tuple with rest parameters at the start', () => {
    type Result = TupleConcat<number[], [1, 2]>
    expectTypeOf<Result>().toEqualTypeOf<[...number[], 1, 2]>()
  })
}
