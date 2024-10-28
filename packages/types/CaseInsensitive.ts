/**
 * Matches a case-insensitive literal string.
 *
 * @template S The string to match.
 * @example CaseInsensitive<'FOO'> // 'foo' | 'Foo' | 'fOO' | 'FOO' ...
 */
export type CaseInsensitive<S extends string> =
  S extends `${infer L}${infer R}`
    ? `${Lowercase<L>}${CaseInsensitive<R>}` | `${Uppercase<L>}${CaseInsensitive<R>}`
    : S
