import type { Absolute, Divide, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNegative, IsAnyNumber, IsDivisibleBy, IsZero, Negative } from './utils'

/**
 * Quotient of two positive integers.
 *
 * @template A The numerator.
 * @template B The denominator.
 * @returns The quotient of the two positive integers
 * @example MathDivide<10, 2> // 5
 */
export type MathDivide<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<B> extends true ? never
        : IsDivisibleBy<A, B> extends false ? number
          : IsAllPositive<A, B> extends true ? Divide<A, B>
            : IsAllNegative<A, B> extends true ? Divide<Absolute<A>, Absolute<B>>
              : IsAnyNegative<A, B> extends true ? Negative<Divide<Absolute<A>, Absolute<B>>>
                : never
