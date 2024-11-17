/**
 * Replace all occurrences of a string in another string with a new string.
 *
 * @template T The string to search.
 * @template S The string to replace.
 * @template R The string to replace with.
 * @returns The result string.
 * @example StringReplace<'~1user~1profile', '~1', '/'> // => '/user/profile'
 */
export type StringReplace<T extends string, S extends string, R extends string = ''> =
  T extends `${infer A}${S}${infer B}` ? StringReplace<`${A}${R}${B}`, S, R>
    : T
