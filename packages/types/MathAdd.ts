import type { Absolute, Add, IsAllNegative, IsAllPositive, IsAnyDecimal, IsAnyNumber, IsEqual, IsLower, IsNegative, IsZero, Negative, Substract } from './utils'

/**
 * Sum of two integers.
 *
 * @template A The first integer.
 * @template B The second integer.
 * @returns The sum of the two integers.
 * @example MathAdd<1, 2> // 3
 */
export type MathAdd<A extends number, B extends number> =
  IsAnyNumber<A, B> extends true ? number
    : IsAnyDecimal<A, B> extends true ? number
      : IsZero<A> extends true ? B
        : IsZero<B> extends true ? A
          : IsAllPositive<A, B> extends true ? Add<A, B>
            : IsAllNegative<A, B> extends true ? Negative<Add<Absolute<A>, Absolute<B>>>
              : IsEqual<Absolute<A>, Absolute<B>> extends true ? 0
                : IsNegative<A> extends true ? IsLower<Absolute<A>, B> extends true ? Substract<B, Absolute<A>> : Negative<Substract<Absolute<A>, B>>
                  : IsNegative<B> extends true ? IsLower<Absolute<B>, A> extends true ? Substract<A, Absolute<B>> : Negative<Substract<Absolute<B>, A>>
                    : never
