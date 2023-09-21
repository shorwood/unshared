/* eslint-disable sonarjs/cognitive-complexity */
/** The Base32 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-6). */
export const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Encode a `ArrayBuffer` to a Base32-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base32-encoded string.
 * @example
 *
 * // Create a buffer from a string
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode a string to Base32
 * encodeBase32(buffer) // 'E5KGQZJAOF2WSY3LEBRHE33XNYQGM33YEBVHK3LQOMQG65TFOIQHI2DFEBWGC6TZEBSG6ZZH'
 */
export function encodeBase32(buffer: ArrayBuffer): string {
  if (buffer.byteLength === 0) return ''
  const view = new DataView(buffer)
  const result: string[] = []
  const remainder = view.byteLength % 5

  // --- Loop over every 5 byte in the ArrayBuffer.
  for (let offset = 4; offset < view.byteLength + 5; offset += 5) {
    const inBounds = offset < view.byteLength
    const byte0 = (inBounds || remainder > 0) ? view.getUint8(offset - 4) : 0
    const byte1 = (inBounds || remainder > 1) ? view.getUint8(offset - 3) : 0
    const byte2 = (inBounds || remainder > 2) ? view.getUint8(offset - 2) : 0
    const byte3 = (inBounds || remainder > 3) ? view.getUint8(offset - 1) : 0
    const byte4 = (inBounds || remainder > 4) ? view.getUint8(offset) : 0

    // --- Encode the 5 bytes into 8 Base32 characters.
    const c1 = ((byte0 >> 3) & 0b00011111)
    const c2 = ((byte0 << 2) & 0b00011100) | ((byte1 >> 6) & 0b00000011)
    const c3 = ((byte1 >> 1) & 0b00011111)
    const c4 = ((byte1 << 4) & 0b00010000) | ((byte2 >> 4) & 0b00001111)
    const c5 = ((byte2 << 1) & 0b00011110) | ((byte3 >> 7) & 0b00000001)
    const c6 = ((byte3 >> 2) & 0b00011111)
    const c7 = ((byte3 << 3) & 0b00011000) | ((byte4 >> 5) & 0b00000111)
    const c8 = byte4 & 0b00011111

    // --- Append the 8 Base32 characters to the result.
    const groupLength = inBounds ? 8 : Math.ceil(remainder * 8 / 5)
    const group = [c1, c2, c3, c4, c5, c6, c7, c8].slice(0, groupLength).map(c => base32Alphabet[c])
    result.push(...group)
  }

  // --- Pad the rest of the string with `=` characters.
  if (remainder > 0) {
    const paddingLength = 8 - Math.ceil(remainder * 8 / 5)
    const padding = '='.repeat(paddingLength)
    result.push(...padding)
  }

  // --- Return the result.
  return result.join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should encode a buffer to a Base32-encoded string with a remainder of 0', () => {
    const buffer = new TextEncoder().encode('Hello, World!!!').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCIJB')
  })

  it('should encode a buffer to a Base32-encoded string with a remainder of 1', () => {
    const buffer = new TextEncoder().encode('Hello, World!!').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('JBSWY3DPFQQFO33SNRSCCII=')
  })

  it('should encode a buffer to a Base32-encoded string with a remainder of 3', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('JBSWY3DPFQQFO33SNRSCC===')
  })

  it('should encode a buffer to a Base32-encoded string with a remainder of 4', () => {
    const buffer = new TextEncoder().encode('Hello, World').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('JBSWY3DPFQQFO33SNRSA====')
  })

  it('should encode a single byte to a Base32-encoded string', () => {
    const buffer = new TextEncoder().encode('A').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('IE======')
  })

  it('should encode an empty buffer to an empty string', () => {
    const buffer = new TextEncoder().encode('').buffer
    const result = encodeBase32(buffer)
    expect(result).toEqual('')
  })
}
