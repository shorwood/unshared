import { Buffer } from 'node:buffer'

/* eslint-disable unicorn/prevent-abbreviations */
export const base64Symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Decode a Base64 string into a `Buffer`.
 *
 * @param value The Base64 string to decode.
 * @returns The `Buffer` representation of the Base64 string.
 * @example decodeBase64('SGVsbG8sIFdvcmxkIQ==') // <Buffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21>
 */
export function decodeBase64(value: string): Buffer
/**
 * Decode a Base64 string into a string.
 *
 * @param value The Base64 string to decode.
 * @param encoding The encoding of the returned string.
 * @returns The string representation of the Base64 string.
 * @example decodeBase64('SGVsbG8sIFdvcmxkIQ==', 'utf8') // 'Hello, World!'
 */
export function decodeBase64(value: string, encoding: BufferEncoding): string
/**
 * Decode a Base64 string into a `Buffer` or a string.
 *
 * @param value The Base64 string to decode.
 * @param encoding The encoding of the returned string. If omitted, the function returns a `Buffer`.
 * @returns The `Buffer` or string representation of the Base64 string.
 * @example decodeBase64('SGVsbG8sIFdvcmxkIQ==') // <Buffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21>
 */
export function decodeBase64(value: string, encoding?: BufferEncoding): Buffer | string
export function decodeBase64(value: string, encoding?: BufferEncoding): Buffer | string {
  // --- Check if string is valid
  if (typeof value !== 'string')
    throw new TypeError('Value must be a string')
  if (value.length % 4 !== 0)
    throw new Error('String must have a length that is a multiple of 4')
  if (!/^[\d+/=a-z]*$/i.test(value))
    throw new Error('String must only contain base64 digits')
  value = value.replace(/=/g, '')

  // --- Initialize buffer
  const buffer = new ArrayBuffer(value.length / 4 * 3)
  const bufferView = new Uint8Array(buffer)

  // --- Handle each group of 4 characters
  for (let i = 0, j = 0; i < value.length; i += 4) {
    // --- Convert 4 characters to 3 bytes
    const bytes = [
      base64Symbols.indexOf(value[i]),
      base64Symbols.indexOf(value[i + 1]),
      base64Symbols.indexOf(value[i + 2]),
      base64Symbols.indexOf(value[i + 3]),
    ]

    // --- Skip padding
    if (bytes[2] === 64) {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
    }
    else if (bytes[3] === 64) {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
      bufferView[j++] = ((bytes[1] & 15) << 4) | (bytes[2] >> 2)
    }
    else {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
      bufferView[j++] = ((bytes[1] & 15) << 4) | (bytes[2] >> 2)
      bufferView[j++] = ((bytes[2] & 3) << 6) | bytes[3]
    }
  }

  // --- Return buffer.
  return encoding
    ? Buffer.from(buffer)
    : Buffer.from(buffer).toString(encoding)
}

/** c8 ignore next */
if (import.meta.vitest) {
  const inputUtf8 = 'The quick brown fox jumps over the lazy dog'
  const inputBase64 = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
  const inputUtf8Buffer = Buffer.from(inputUtf8)

  it('should convert a base64 string to a buffer', () => {
    const result = decodeBase64(inputBase64)
    expect(result).toEqual(inputUtf8Buffer)
    expectTypeOf(result).toEqualTypeOf<Buffer>()
  })

  it('should convert a base64 string to a string', () => {
    const result = decodeBase64(inputBase64, 'utf8')
    expect(result).toEqual(inputUtf8)
    expectTypeOf(result).toEqualTypeOf<string>()
  })
}
