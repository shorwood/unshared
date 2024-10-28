import type { Tuple } from './Tuple'
import type { IsDecimal, IsNumber, IsZero } from './utils'

/**
 * A 2-dimensional square matrix size `D` of elements of type `U`.
 *
 * @template U The type of the elements.
 * @example Matrix<number> // number[][][]
 */
export type Matrix<L extends number = number, U = unknown> =
  IsNumber<L> extends true ? U[][]
    : IsZero<L> extends true ? []
      : IsDecimal<L> extends true ? never
        : Tuple<L, Tuple<L, U>>
