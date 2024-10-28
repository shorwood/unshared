import type { IsDecimal, IsNegative, IsNumber } from './utils'

/**
 * A negative decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative decimal number.
 * @example NumberDecimalNegative<-1.1> // -1.1
 */
export type NumberDecimalNegative<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true
      ? IsNegative<N> extends true ? N
        : never : never
