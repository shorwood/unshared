/**
 * Join a list of strings with a delimiter. This is the reverse operation of
 * {@linkcode StringSplit}. The delimiter is optional and defaults to an empty
 * string.
 *
 * @template T The list of strings to join.
 * @template S The delimiter to join strings with.
 * @returns The joined string.
 */

export type StringJoin<T extends string[], S extends string = ''> =
  string[] extends T ? string
    : T extends [infer A extends string, ...infer B extends string[]]
      ? B extends [] ? A : `${A}${S}${StringJoin<B, S>}`
      : ''
