import type { MathAdd } from './MathAdd'

/**
 * Integer increased by 1
 *
 * @template N The number to increase
 * @returns The number increased by 1
 * @example MathIncrease<1> // 2
 */
export type MathIncrease<N extends number> = MathAdd<N, 1>
