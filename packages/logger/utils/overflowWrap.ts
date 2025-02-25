/**
 * Wrap the overflowing part of a string in a new line.
 *
 * @param text The string to wrap.
 * @param maxWidth The maximum width of the string.
 * @returns The wrapped string.
 * @example overflowWrap('Hello world', 2) // 'Hello\nworld'
 */
export function overflowWrap(text: string, maxWidth: number): string {
  const exp = new RegExp(`(.{1,${maxWidth}})[\\s\\n]`, 'g')
  return text.replaceAll(exp, '$1\n')
}
