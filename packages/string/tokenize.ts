/**
 * Tokenize a string into an array of strings. Each token is a sequence of
 * characters that are separated by a non-alphanumeric character or by a
 * change in case.
 *
 * @param string The string to tokenize into an array of tokens.
 * @returns The list of tokens extracted from the string.
 * @example tokenize('fooBar') // => ['foo', 'Bar']
 */
export function tokenize(string: string): string[] {
  return [...string.trim().matchAll(/[A-Z]?[a-z]+|[A-Z]+|\d+/gs)].map(match => match[0])
}
