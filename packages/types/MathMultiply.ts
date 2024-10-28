import type { Absolute, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsAnyZero, Multiply, Negative } from './utils'

/**
 * Product of two positive integers.
 *
 * @template A The multiplicand.
 * @template B The multiplier.
 * @returns The product of the two positive integers.
 * @example MathMultiply<4, 4> // 16
 */
export type MathMultiply<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsAnyZero<A, B> extends true ? 0
        : IsAllPositive<A, B> extends true ? Multiply<A, B>
          : IsAllNegative<A, B> extends true ? Multiply<Absolute<A>, Absolute<B>>
            : IsAnyNegative<A, B> extends true ? Negative<Multiply<Absolute<A>, Absolute<B>>>
              : never
