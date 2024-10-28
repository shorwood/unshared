/**
 * Infer a literal number from a literal string.
 *
 * @template N The literal string to infer from.
 * @returns The number inferred from the literal string.
 * @example
 * // Infer a literal number from a literal string
 * StringNumber<'-42.1'> // -42.1
 *
 * // Infer to number when a string is passed
 * StringNumber<string> // number
 *
 * // Infer to never when a non-number is passed
 * StringNumber<'a'> // never
 */
export type StringNumber<N extends string> =
  string extends N ? number :
    N extends `${infer S extends number}` ? S
      : never
