import type { MathAdd } from './MathAdd'

/**
 * Integer decreased by 1.
 *
 * @template N The integer to decrease.
 * @returns The integer decreased by 1.
 * @example MathDecrease<2> // 1
 */
export type MathDecrease<N extends number> = MathAdd<N, -1>
