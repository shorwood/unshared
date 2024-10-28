/**
 * Capitalize the first letter of a string.
 *
 * @template S The input string type.
 * @returns The capitalized string.
 * @example Capitalized<'fooBar'> // 'FooBar'
 */
export type Capitalized<S extends string> =
  S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : S

/**
 * Capitalize the first letter of a string. The returned type is inferred
 * from the input string.
 *
 * @param value The string to capitalize.
 * @returns The capitalized string.
 * @example toCapitalized('fooBar') // 'FooBar'
 */
export function toCapitalized<S extends string>(value: S): Capitalized<S> {
  if (value.length === 0) return value as Capitalized<S>
  if (value.length === 1) return value.toUpperCase() as Capitalized<S>
  return value.charAt(0).toUpperCase() + value.slice(1) as Capitalized<S>
}
