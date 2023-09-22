import { BASE_16_ALPHABET } from './encodeBase16'

/** Regular expression to test if a string is a valid Base16 string. */
const BASE_16_REGEXP = /^[\da-f]+$/i

/**
 * Decode a Base16-encoded string into an `ArrayBuffer`. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base16 The Base16 string to decode.
 * @returns The decoded `ArrayBuffer`.
 * @example
 *
 * // Create a Base16 string
 * const base32 = 'KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWO==='
 *
 * // Decode a Base16 string to an ArrayBuffer
 * const buffer = decodeBase16(base32) // <ArrayBuffer 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
function decodeBase16(base16: string): ArrayBuffer {
  if (base16.length % 2 !== 0)
    throw new Error('Could not decode string as Base16: Length is not a multiple of 2')
  if (BASE_16_REGEXP.test(base16) === false)
    throw new Error('Could not decode string as Base16: Invalid characters')

  // --- Decode every 2 characters into 1 byte.
  const result: number[] = []
  for (let index = 0; index < base16.length; index += 2) {
    const c0 = BASE_16_ALPHABET.indexOf(base16[index])
    const c1 = BASE_16_ALPHABET.indexOf(base16[index + 1])
    const byte = (c0 << 4) | c1
    result.push(byte)
  }

  // --- Return as ArrayBuffer
  return new Uint8Array(result).buffer
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should decode an hexadecimal string into a buffer', () => {
    const result = decodeBase16('123456')
    const expected = new Uint8Array([0x12, 0x34, 0x56]).buffer
    expect(result).toEqual(expected)
  })

  it('should decode lowercase hexadecimal characters', () => {
    const result = decodeBase16('abcdef')
    const expected = new Uint8Array([0xAB, 0xCD, 0xEF]).buffer
    expect(result).toEqual(expected)
  })

  it('should throw if the string is not a multiple of 2', () => {
    const shouldThrow = () => decodeBase16('123')
    expect(shouldThrow).toThrow()
  })

  it('should throw if the string contains non-hexadecimal characters', () => {
    const shouldThrow = () => decodeBase16('0000G')
    expect(shouldThrow).toThrow()
  })
}
