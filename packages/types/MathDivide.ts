import { AllPositive, MultiSub } from './utils'

/**
 * Quotient of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer.
 * @returns The quotient of the two positive integers
 * @example MathDivide<10, 2> // 5
 */
export type MathDivide<A extends number, B extends number> =
  AllPositive<A, B> extends true ? MultiSub<A, B, 0> : never
