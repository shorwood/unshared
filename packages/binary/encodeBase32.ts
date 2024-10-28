import type { BinaryLike } from './toUint8Array'
import { B32 } from './constants'
import { toUint8Array } from './toUint8Array'

/**
 * Encode a `BinaryLike` into a Base32-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base32-encoded string.
 * @example encodeBase32('Hello, World') // 'JBSWY3DPFQQFO33SNRSA===='
 */
export function encodeBase32(value: BinaryLike): string {
  const view = toUint8Array(value)
  let result = ''

  // --- Loop over every byte in the Buffer in 5-byte chunks.
  for (let i = 0; i < view.byteLength; i += 5) {
    const remaining = view.byteLength - i

    // --- Get 5 bytes from the buffer.
    if (remaining === 0) break
    const byte0 = view[i]
    const byte1 = (remaining > 1) ? view[i + 1] : 0
    const byte2 = (remaining > 2) ? view[i + 2] : 0
    const byte3 = (remaining > 3) ? view[i + 3] : 0
    const byte4 = (remaining > 4) ? view[i + 4] : 0

    // --- Encode the 5 bytes into 8 Base32 characters.
    const c0 = ((byte0 >> 3) & 0b00011111)
    const c1 = ((byte0 << 2) & 0b00011100) | ((byte1 >> 6) & 0b00000011)
    const c2 = ((byte1 >> 1) & 0b00011111)
    const c3 = ((byte1 << 4) & 0b00010000) | ((byte2 >> 4) & 0b00001111)
    const c4 = ((byte2 << 1) & 0b00011110) | ((byte3 >> 7) & 0b00000001)
    const c5 = ((byte3 >> 2) & 0b00011111)
    const c6 = ((byte3 << 3) & 0b00011000) | ((byte4 >> 5) & 0b00000111)
    const c7 = byte4 & 0b00011111

    // --- Append the 8 Base32 characters to the result.
    switch (remaining) {
      case 1: { result += `${B32[c0] + B32[c1]}======`; break }
      case 2: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3]}====`; break }
      case 3: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4]}===`; break }
      case 4: { result += `${B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6]}=`; break }
      default: { result += B32[c0] + B32[c1] + B32[c2] + B32[c3] + B32[c4] + B32[c5] + B32[c6] + B32[c7] }
    }
  }

  return result
}
