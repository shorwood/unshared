import type { IsInteger, IsNumber, IsPositive, IsZero } from './utils'

/**
 * A strictly positive integer number. Excludes zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a strict positive integer.
 * @example NumberIntegerPositive<1> // 1
 */
export type NumberIntegerPositive<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? never
      : IsInteger<N> extends true
        ? IsPositive<N> extends true ? N
          : never : never
