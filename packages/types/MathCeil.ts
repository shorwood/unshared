import type { Add, IsInteger, IsNumber, Negative } from './utils'

/**
 * Ceils a number to the nearest integer.
 *
 * @template N The number to ceil.
 * @returns The ceiled number.
 * @example MathCeil<1.1> // 2
 */
export type MathCeil<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true ? N
      : `${N}` extends `-${infer S extends number}.${number}` ? Negative<S>
        : `${N}` extends `${infer S extends number}.${number}` ? Add<S, 1>
          : never
