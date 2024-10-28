import type { IsNegative, IsNumber } from './utils'

/**
 * A strictly negative number lower than zero.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be strictly negative.
 * @example NumberNegative<-1> // -1
 */
export type NumberNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsNegative<N> extends true ? N
      : never
