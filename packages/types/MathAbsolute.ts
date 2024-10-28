import type { Absolute } from './utils/arithmetics'
import type { IsNumber, IsZero } from './utils/predicate'

/**
 * Returns the absolute value of a number.
 *
 * @template N The number to get the absolute value of.
 * @returns The absolute value of the number.
 * @example MathAbsolute<-1> // 1
 */
export type MathAbsolute<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? 0
      : Absolute<N>
