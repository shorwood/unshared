/* eslint-disable @typescript-eslint/consistent-type-imports */
import { isBrowser, requireSafe } from '../misc'

/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * As `Math.random()` is cryptographically not safe to use.
 *
 * On browser, if `window.crypto` is undefined, falls back
 * to using Math.random() to generate an integer
 * @returns {number} a random number
 * @see https://github.com/brix/crypto-js/blob/develop/src/core.js#L47
 */
export const random = (): number => {
  // --- If browser environment, use `globalThis.crypto`, falls back to `Math.random()`
  if (isBrowser) {
    return globalThis.crypto
      ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0]
      : Math.trunc(Math.random() * 0xFFFFFFFF)
  }

  // --- If NodeJS, use `node:crypto`.
  return requireSafe<typeof import('node:crypto')>('node:crypto').randomBytes(4).readInt32LE()
}