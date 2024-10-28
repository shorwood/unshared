import type { Absolute, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsZero, Modulo, Negative } from './utils'

/**
 * Remainder of the division of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer.
 * @returns The remainder of the division of the two positive integers.
 * @example MathModulo<1, 2> // 1
 */
export type MathModulo<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<B> extends true ? never
        : IsAllPositive<A, B> extends true ? Modulo<A, B>
          : IsAllNegative<A, B> extends true ? Modulo<Absolute<A>, Absolute<B>>
            : IsAnyNegative<A, B> extends true ? Negative<Modulo<Absolute<A>, Absolute<B>>>
              : never
