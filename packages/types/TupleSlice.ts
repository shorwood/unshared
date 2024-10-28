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
