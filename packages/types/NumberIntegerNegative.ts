import type { IsInteger, IsNegative, IsNumber } from './utils'

/**
 * A negative integer.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative integer.
 * @example NumberIntegerNegative<1> // 1
 */
export type NumberIntegerNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true
      ? IsNegative<N> extends true ? N
        : never : never
