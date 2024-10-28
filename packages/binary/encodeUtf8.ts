import type { BinaryLike } from './toUint8Array'
import { toUint8Array } from './toUint8Array'

/**
 * Encode a `BinaryLike` into a UTF8-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The UTF8-encoded string.
 * @example encodeUtf8([72, 101, 108, 108, 111, 44, 32, 240, 159, 140, 141, 33]) // 'Hello, 🌍!'
 */
export function encodeUtf8(value: BinaryLike): string {
  const array = toUint8Array(value)
  return new TextDecoder().decode(array)
}
