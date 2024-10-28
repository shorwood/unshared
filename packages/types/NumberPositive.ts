import type { IsNumber, IsPositive, IsZero } from './utils'

/**
 * A strictly positive number greater than zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be striclty positive.
 * @example NumberPositive<1> // 1
 */
export type NumberPositive<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? never
      : IsPositive<N> extends true ? N
        : never
