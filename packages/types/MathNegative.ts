import type { IsNumber, IsZero, Negative } from './utils'

/**
 * The negative of a number.
 *
 * @template N The number to negate.
 * @returns The negative of the number.
 * @example MathNegative<1> // -1
 */
export type MathNegative<N extends number> =
  IsNumber<N> extends true ? number
    : IsZero<N> extends true ? 0
      : Negative<N>
