import type { Substract } from '@unshared/types'

export type Repeated<T extends string, N extends number, S extends string = ''> =
  N extends 0 ? '' :
    N extends 1 ? T :
      `${T}${S}${Repeated<T, Substract<N, 1>, S>}`

/**
 * Repeats the given string n times and returns the result.
 *
 * @param value The string to repeat.
 * @param length The number of times to repeat the string.
 * @param separator The string to separate each repetition.
 * @returns The repeated string.
 */
export function repeat<T extends string, L extends number, S extends string = ''>(value: T, length: L, separator = '' as S): Repeated<T, L, S> {
  if (length <= 0) return '' as Repeated<T, L, S>
  return Array.from({ length }).fill(value).join(separator) as Repeated<T, L, S>
}
