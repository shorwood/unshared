import type { IsDecimal, IsNumber, IsPositive } from './utils'

/**
 * A positive decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a positive decimal number.
 * @example NumberDecimalPositive<1.1> // 1.1
 */
export type NumberDecimalPositive<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true
      ? IsPositive<N> extends true ? N
        : never : never
