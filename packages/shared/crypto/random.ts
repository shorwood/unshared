import { isBrowser, requireSafe } from '../misc'

/**
 * Returns a cryptographically secure pseudorandom number.
 * As `Math.random()` is cryptographically not safe to use.
 * @returns {number} a random number
 * @see https://github.com/brix/crypto-js/blob/develop/src/core.js#L47
 */
export const random = (): number => (
  isBrowser
    ? window.crypto.getRandomValues(new Uint32Array(1))[0]
    : requireSafe('node:crypto').randomBytes(4).readInt32LE()
)
