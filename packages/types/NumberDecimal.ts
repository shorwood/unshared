import type { IsDecimal, IsNumber } from './utils'

/**
 * A decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a positive decimal number.
 * @example NumberDecimal<1.1> // 1.1
 */
export type NumberDecimal<N extends number = number> =
  IsNumber<N> extends true ? number
    : IsDecimal<N> extends true ? N
      : never
