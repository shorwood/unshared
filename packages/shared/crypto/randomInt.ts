import { randomBytes } from 'node:crypto'

/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * Falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @return A random number
 */
export const randomInt = (): number => randomBytes(4).readUint32LE(0)
