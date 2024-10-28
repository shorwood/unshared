import type { BinaryLike } from './toUint8Array'
import { B64 } from './constants'
import { toUint8Array } from './toUint8Array'

/**
 * Encode a `BinaryLike` into a Base64-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base64-encoded string.
 * @example encodeBase64('Hello, World!') // 'SGVsbG8sIFdvcmxkIQ=='
 */
export function encodeBase64(value: BinaryLike): string {
  const view = toUint8Array(value)
  let result = ''

  // --- Loop over every byte in the Buffer in 3-byte chunks.
  for (let i = 0; i < view.byteLength; i += 3) {
    const remaining = view.byteLength - i

    // --- Get 3 bytes from the buffer.
    if (remaining === 0) break
    const byte1 = view[i]
    const byte2 = (remaining > 1) ? view[i + 1] : 0
    const byte3 = (remaining > 2) ? view[i + 2] : 0

    // --- Convert the 3 bytes into 4 Base64 characters
    const c0 = ((byte1 >> 2) & 0b00111111)
    const c1 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const c2 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const c3 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    switch (remaining) {
      case 1: { result += `${B64[c0] + B64[c1]}==`; break }
      case 2: { result += `${B64[c0] + B64[c1] + B64[c2]}=`; break }
      default: { result += B64[c0] + B64[c1] + B64[c2] + B64[c3] }
    }
  }

  return result
}
