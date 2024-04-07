import { BinaryLike, toUint8Array } from './toUint8Array'

/** The Base16 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-8). */
export const B16 = '0123456789abcdef'

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

/* v8 ignore start */
if (import.meta.vitest) {
  describe('input conversion', () => {
    it('should encode an Array into a Base16-encoded string', () => {
      const result = encodeBase16([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64])
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })

    it('should encode an `BinaryLike` into a Base16-encoded string', () => {
      const buffer = new TextEncoder().encode('Hello, World').buffer
      const result = encodeBase16(buffer)
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })

    it('should encode a `Buffer` into a Base16-encoded string', () => {
      const buffer = Buffer.from('Hello, World')
      const result = encodeBase16(buffer)
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })

    it('should encode a `string` into a Base16-encoded string', () => {
      const result = encodeBase16('Hello, World')
      expect(result).toEqual('48656c6c6f2c20576f726c64')
    })
  })

  describe('edge cases', () => {
    it('should encode an empty buffer', () => {
      const result = encodeBase16([])
      expect(result).toEqual('')
    })

    it('should encode a buffer with a single byte', () => {
      const result = encodeBase16([0x10])
      expect(result).toEqual('10')
    })
  })
}
