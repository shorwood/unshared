export const REGEXP_EMOJI = /^(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])$/

/**
 * Check if string matches an [emoji](https://en.wikipedia.org/wiki/Emoji) character.
 *
 * @param value The value to check
 * @returns `true` if string matches an emoji character, `false` otherwise
 * @see
 * @example isStringEmoji('💩') // true
 */
export function isStringEmoji(value: string): boolean {
  return typeof value === 'string' && REGEXP_EMOJI.test(value)
}
