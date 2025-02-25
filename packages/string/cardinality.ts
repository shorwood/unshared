/**
 * Options for estimating the cardinality of a string.
 */
interface CardinalityOptions {

  /**
   * The cardinality value for lowercase letters. Determines the
   * value of the cardinality when a lowercase letter is found.
   *
   * @default 26
   */
  lower?: number

  /**
   * The cardinality value for uppercase letters. Determines the
   * value of the cardinality when an uppercase letter is found.
   *
   * @default 26
   */
  upper?: number

  /**
   * The cardinality value for digits. Determines the value of the
   * cardinality when a digit is found.
   *
   * @default 10
   */
  digit?: number

  /**
   * The cardinality value for ASCII characters. Determines the
   * value of the cardinality when an ASCII character is found.
   *
   * @default 33
   */
  ascii?: number

  /**
   * The cardinality value for Unicode characters. Determines the
   * value of the cardinality when a Unicode character is found.
   *
   * @default 100
   */
  unicode?: number
}

/**
 * Estimate the “cardinality” (size of the possible symbol set)
 * for a given string.
 *
 * @param value The string to estimate the cardinality of.
 * @param options Optional overrides for the default cardinality values.
 * @returns The estimated cardinality of the string.
 * @example
 *
 * // Sum of the cardinality of lower and uppercase letters.
 * cardinality('Hello World') // => 26 + 26
 *
 * // Sum of the cardinality of each character type.
 * cardinality('aA1!你') // => 26 + 26 + 10 + 33 + 100
 *
 * // Assign a custom cardinality value to each character type.
 * cardinality('Hello World', { lower: 1, upper: 2 }) // => 3
 */
export function cardinality(value: string, options: CardinalityOptions = {}): number {
  const {
    lower = 26,
    upper = 26,
    digit = 10,
    ascii = 33,
    unicode = 100,
  } = options

  let card = 0
  let types = 0
  for (const character of value) {
    if (character >= 'a' && character <= 'z') types |= 1 // lowercase letter
    else if (character >= 'A' && character <= 'Z') types |= 2 // uppercase letter
    else if (character >= '0' && character <= '9') types |= 4 // digit
    else if (character.codePointAt(0)! <= 0x7F) types |= 8 // punctuation/ASCII
    else types |= 16 // other (e.g. Unicode)
  }
  if (types & 1) card += lower
  if (types & 2) card += upper
  if (types & 4) card += digit
  if (types & 8) card += ascii
  if (types & 16) card += unicode
  return card
}
