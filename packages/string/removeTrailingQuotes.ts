/**
 * Remove trailing quotes from a string value. If the value is not quoted,
 * it is returned as is.
 *
 * @param string The string to remove trailing quotes from.
 * @returns The string without trailing quotes.
 * @example removeTrailingQuotes('"Hello, world!"') // 'Hello, world!'
 */
export function removeTrailingQuotes(string: string) {
  return string.startsWith('"') && string.endsWith('"')
    ? string.slice(1, -1)
    : string
}
