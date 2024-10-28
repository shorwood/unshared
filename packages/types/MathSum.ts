import type { MathAdd } from './MathAdd'

/**
 * Computes the sum of a tuple of numbers.
 *
 * @template N The tuple of numbers.
 * @returns The sum of the numbers.
 * @example MathSum<[1, 2, 3]> // 6
 */
export type MathSum<N extends number[]> =
  N extends [infer A extends number, ...infer B extends number[]]
    ? MathAdd<A, MathSum<B>>
    : N extends [infer A extends number] ? A : 0
