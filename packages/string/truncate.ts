import type { NumberIntegerPositive } from '@unshared/types'

export interface TruncateOptions<N extends number = number> {

  /**
   * Allow words to be broken if they exceed the `length` option. If `true`,
   * the word will be broken at the `length` option. If `false`, the entire
   * word will be excluded from the result. This option is ignored if the result
   * contains a single word.
   *
   * @default false
   * @example truncate('Hello, world!', { length: 10, breakWords: true }) // 'Hello...'
   */
  breakWords?: boolean

  /**
   * If defined, the ellipsis character sequence that will be used to replace the
   * last characters of the string when it is truncated. This means that the final
   * length of the string will be still be less than or equal to `length`.
   *
   * @default ''
   * @example truncate('Hello, world!', { length: 6, ellipsis: '…' }) // 'Hello…'
   */
  ellipsis?: string

  /**
   * The maximum length of the string. If the string is longer than this value,
   * (including the ellipsis) the string will be truncated and the last characters
   * will be replaced with the ellipsis.
   *
   * @default Number.MAX_SAFE_INTEGER
   * @example truncate('Hello, world!', { length: 5 }) // 'Hello'
   */
  length?: NumberIntegerPositive<N>
}

/**
 * Truncate a string to a specified length. By default, if the string is longer
 * than the specified length, the string is cut-off at the nearest word boundary.
 * You can change this behavior by setting the `breakWords` option to `true`.
 *
 * You can provide a custom ellipsis character sequence to replace the last
 * characters of the string when it is truncated.
 *
 * @param string The string to truncate.
 * @param length The length at which to truncate the string.
 * @returns The truncated string.
 * @example truncate('Hello, world!', 10) // 'Hello'
 */
export function truncate<N extends number>(string: string, length: NumberIntegerPositive<N>): string

/**
 * Truncate a string to a specified length. By default, if the string is longer
 * than the specified length, the string is cut-off at the nearest word boundary.
 * You can change this behavior by setting the `breakWords` option to `true`.
 *
 * You can provide a custom ellipsis character sequence to replace the last
 * characters of the string when it is truncated.
 *
 * @param string The string to truncate.
 * @param options The truncate options.
 * @returns The truncated string.
 * @example
 *
 * // Truncate a string to a specified length without breaking words.
 * truncate('Hello, world!', { length: 10 }) // 'Hello'
 *
 * // Truncate a string to a specified length and break words.
 * truncate('Hello, world!', { length: 10, breakWords: true }) // 'Hello...'
 *
 * // Truncate a string to a specified length with an ellipsis.
 * truncate('Hello, world!', { length: 10, ellipsis: '...' }) // 'Hello...'
 *
 * // Truncate a single word with an ellipsis.
 * truncate('Hello', { length: 5, ellipsis: '...' }) // 'He...'
 */
export function truncate<N extends number>(string: string, options: TruncateOptions<N>): string
export function truncate(string: string, optionsOrLength: TruncateOptions | number = {}): string {
  const options = typeof optionsOrLength === 'number' ? { length: optionsOrLength } : optionsOrLength
  const { breakWords = false, ellipsis = '', length = Number.MAX_SAFE_INTEGER } = options

  // --- Throw an error if the ellipsis is longer or equal to the length.
  if (Number.isSafeInteger(length) === false) throw new TypeError('The length must be a safe integer.')
  if (length <= 0) throw new RangeError('The length must be a positive integer.')
  if (ellipsis.length >= length) throw new RangeError('The ellipsis must be shorter than the length.')

  // --- If the string is shorter than the maximum length, return early.
  if (string.length <= length) return string

  // --- Otherwise, truncate the string at the last space. (If possible)
  const index = string.lastIndexOf(' ', length - ellipsis.length)
  return (index > length) || (index === -1) || breakWords
    ? string.slice(0, length - ellipsis.length) + ellipsis
    : string.slice(0, index) + ellipsis
}
