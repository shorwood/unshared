import { Decrease } from './arithmetic'

/**
 * Convert to literal type.
 * @param T - Type to convert to literal type.
 * @Returnss Literal type.
 */
export type Literal<T> = string extends T
  ? string
  : `${Extract<T, string | number | bigint | boolean | null | undefined>}`

/**
 * String constrained by character and length
 * @param C Character constraint
 * @param L Length constraint
 * @param T Prepended string
 * @returns String constrained by character and length
 */
export type StringConstraint<C, L extends number, T extends string = ''> = number extends L
  ? string
  : L extends 0 ? T: `${T}${Literal<C>}${StringConstraint<C, Decrease<L>>}`

/**
 * Extract litteral types of strings separated by a delimiter.
 * @param S String to extract litteral types from.
 * @param D Delimiter to split string with.
 * @param N Maximum number of splits. (default: `128`)
 */
export type Split<S extends string, D extends string = ',', N extends number = 128> =
  N extends 0
    ? never
    : S extends `${infer A}${D}${infer B}`
      ? `${A}` | Split<B, D, Decrease<N>>
      : `${S}`
