import type { BinaryLike } from './toUint8Array'
import { encodeBase64 } from './encodeBase64'

/**
 * Encode a `BinaryLike` into a Base64-encoded string. This implementation is
 * agnostic to the environment and can be used in both Node.js and browsers.
 *
 * @param value The value to encode.
 * @returns The Base64-encoded string.
 * @example encodeBase64Url('Hello, World!') // 'SGVsbG8sIFdvcmxkIQ'
 */
export function encodeBase64Url(value: BinaryLike): string {
  return encodeBase64(value)
    .replaceAll(/([+/])|(={1,3}$)/g, (match) => {
      if (match === '+') return '-'
      if (match === '/') return '_'
      return ''
    })
}
