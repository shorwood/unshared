import type { MathAdd } from './MathAdd'
import type { MathNegative } from './MathNegative'

/**
 * Difference of two positive integers.
 *
 * @template A The first positive integer.
 * @template B The second positive integer
 * @returns The difference of the two positive integers.
 */
export type MathSubstract<A extends number, B extends number> = MathAdd<A, MathNegative<B>>
