/**
 * Tokenize a string into an array of strings.
 * @param {string} value The string to tokenize
 * @returns {string[]} The list of tokens
 * @example
 * tokenize('This is a test') // => ['This', 'is', 'a', 'test']
 */
export const tokenize = (value: string): string[] => {
  // --- Handle edge cases.
  if (value === '') return []
  if (/^\s+$/.test(value)) return []

  // --- Extract all tokens.
  const tokens = value.matchAll(/[A-Z]?[\da-z]+|[\dA-Za-z]+/gs)

  // --- Return tokens
  return [...tokens].map(token => token[0])
}
