import type { BinaryLike } from './toUint8Array'
import { B16 } from './constants'
import { toUint8Array } from './toUint8Array'

/**
 * Encode a `BinaryLike` into a Base16-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base16-encoded string.
 * @example encodeBase16('Hello, World') // '48656c6c6f2c20576f726c64'
 */
export function encodeBase16(value: BinaryLike): string {
  const view = toUint8Array(value)
  let result = ''

  // --- For every byte in the buffer, convert it to 2 Base16 characters.
  for (let offset = 0; offset < view.byteLength; offset++) {
    const byte = view[offset]
    const c0 = (byte >> 4) & 0b00001111
    const c1 = byte & 0b00001111
    result += B16[c0] + B16[c1]
  }

  return result
}
