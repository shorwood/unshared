import type { IsInteger, IsNumber } from './utils'

/**
 * An integer number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be an integer.
 * @example NumberInteger<1> // 1
 */
export type NumberInteger<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true ? N
      : never
