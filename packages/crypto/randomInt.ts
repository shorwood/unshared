import { requireSafe } from '@unshared-dev/module/requireSafe'

/**
 * Returns a cryptographically secure pseudorandom 32-bit number.
 * Falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @param allowUnsafe If `true`, falls back to Math.random() if `node:crypto` and `globalThis.crypto` is not available.
 * @return A random number
 * @throws If `node:crypto` and `globalThis.crypto` is not available and `allowUnsafe` is `false`
 * @example
 * randomInt() // 1234567890
 */
export const randomInt = (allowUnsafe?: boolean): number => {
  // --- Node.js context
  const crypto = requireSafe('node:crypto')
  if (crypto?.randomBytes) return crypto.randomBytes(4).readUint32LE(0)

  // --- Browser context
  if (globalThis.crypto?.getRandomValues)
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0]

  // --- Fallback (if allowed)
  if (allowUnsafe)
    return Math.floor(Math.random() * 0xFFFFFFFF)

  // --- Throw if unsafe is not allowed
  throw new Error('No cryptographically secure random number generator available')
}
