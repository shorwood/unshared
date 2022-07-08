/**
 * Check if string matches an emoji character.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches an emoji character, `false` otherwise
 * @see https://en.wikipedia.org/wiki/Emoji
 * @example
 * isStringEmoji('💩') // true
 * isStringEmoji('💩💩') // false
 */
export const isStringEmoji = (value: string): boolean =>
  typeof value === 'string'
  && /^(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])$/.test(value)
