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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should encode a buffer into a UTF-8 string', () => {
    const buffer = Buffer.from('Hello, World!')
    const result = encodeUtf8(buffer)
    expect(result).toBe('Hello, World!')
  })

  test('should encode an ArrayBuffer into a UTF-8 string', () => {
    const buffer = new TextEncoder().encode('Hello, World!')
    const result = encodeUtf8(buffer)
    expect(result).toBe('Hello, World!')
  })

  test('should encode an Array into a UTF-8 string', () => {
    const result = encodeUtf8([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64])
    expect(result).toBe('Hello, World')
  })

  test('should encode a string into a UTF-8 string', () => {
    const result = encodeUtf8('Hello, World')
    expect(result).toBe('Hello, World')
  })

  test('should keep the special characters in the string', () => {
    const result = encodeUtf8([72, 101, 108, 108, 111, 44, 32, 240, 159, 140, 141, 33])
    expect(result).toBe('Hello, 🌍!')
  })
}
