import type { MathMultiply } from './MathMultiply'

/**
 * The square of a number.
 *
 * @template N The number to square.
 * @returns The square of the number.
 * @example MathSquare<2> // 4
 */
export type MathSquare<N extends number> = MathMultiply<N, N>
