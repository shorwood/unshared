/**
 * Matches username identifier for the VOIP application Discord.
 *
 * Example of matched strings:
 * - `Kari#1234`
 * - `EarlS5#3678`
 * - `DrDeeC#2412`
 *
 * @see https://support.discordapp.com/hc/en-us/articles/210298617-What-is-a-Discord-Tag-
 */
export const discordUsername = /^.{3,32}#\d{4}$/

/**
 * Matches Bitcoin address.
 *
 * Example of matched strings:
 * - `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq`
 * - `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`
 *
 * @see https://en.wikipedia.org/wiki/Bitcoin
 */
export const bitcoinAddress = /^(bc1|[13])[\dA-HJ-NP-Za-z]{25,39}$/

/** Matches valid Firestore document ID */
export const firestoreId = /^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$/
/**
 * Matches emojis.
 *
 * Example of matched strings:
 * - `\u00A9`
 * - `\u00AE`
 * - `\u2000`
 * - `\u3300`
 * - `\uD83C\uD000`
 * - `\uD83C\uDFFF`
 * - `\uD83D\uD000`
 * - `\uD83D\uDFFF`
 * - `\uD83E\uD000`
 * - `\uD83E\uDFFF`
 *
 * @see https://en.wikipedia.org/wiki/Emoji
 */
export const emoji = /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/
