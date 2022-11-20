import { requireSafe } from '../module/requireSafe'

/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * Falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @return A random number
 */
export const randomInt = (): number =>
  requireSafe('node:crypto')?.randomBytes(4).readUint32LE(0)
  ?? globalThis.crypto?.getRandomValues(new Uint32Array(1))[0]
  ?? Math.floor(Math.random() * 0xFFFFFFFF)
