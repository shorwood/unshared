import type { Add, IsInteger, IsNumber, Negative } from './utils'

/**
 * Floors a number to the nearest integer.
 *
 * @template N The number to floor.
 * @returns The floored number.
 * @example MathFloor<1.1> // 1
 */
export type MathFloor<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true ? N
      : `${N}` extends `-${infer S extends number}.${number}` ? Negative<Add<S, 1>>
        : `${N}` extends `${infer S extends number}.${number}` ? S
          : never
