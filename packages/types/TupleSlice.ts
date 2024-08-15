import type { MathSubstract } from './MathSubstract'
import type { TupleLength } from './TupleLength'
import type { IsNumber, IsZero } from './utils'

/**
 * Extract a slice of a tuple type.
 *
 * @template T Tuple type to extract a slice from.
 * @template I Starting index of the slice.
 * @template J Ending index of the slice.
 * @returns The slice of the tuple type.
 * @example TupleSlice<[1, 2, 3, 4, 5], 1, 3> // [2, 3, 4]
 */
export type TupleSlice<T extends unknown[], I extends number = 0, J extends number = TupleLength<T>> =
  IsNumber<I> extends true ? T
    : T extends [infer Head, ...infer Tail]
      ? IsZero<I> extends true
        ? IsZero<J> extends true
          ? []
          : [Head, ...TupleSlice<Tail, 0, MathSubstract<J, 1>>]
        : TupleSlice<Tail, MathSubstract<I, 1>, MathSubstract<J, 1>>
      : []

/* v8 ignore next */
if (import.meta.vitest) {
  test('should extract a slice of a tuple type from the beginning', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 1>
    type Expected = [2, 3, 4, 5]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract a slice of a tuple type from the end', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 0, 4>
    type Expected = [1, 2, 3, 4]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract a slice of a tuple type from the middle', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], 2, 4>
    type Expected = [3, 4]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return as-is if the starting index is number', () => {
    type Result = TupleSlice<[1, 2, 3, 4, 5], number>
    type Expected = [1, 2, 3, 4, 5]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
