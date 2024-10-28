/**
 * Matches a literal string type or never.
 *
 * @template T Type to match.
 * @returns The literal type.
 * @example
 * // Does not match a string type.
 * StringLiteral<string> // never
 *
 * // Matches a literal string.
 * StringLiteral<'foo'> // 'foo'
 */
export type StringLiteral<T extends string> =
  string extends T
    ? T extends string ? never
      : T : T
