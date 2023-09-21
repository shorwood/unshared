import { base32Alphabet } from './encodeBase32'

/**
 * Decode a Base32-encoded string into an `ArrayBuffer`. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param base32 The Base32 string to decode.
 * @returns The decoded `ArrayBuffer`.
 * @example
 *
 * // Create a Base32 string
 * const base32 = 'KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWO==='
 *
 * // Decode a Base32 string to an ArrayBuffer
 * const buffer = decodeBase32(base32) // <ArrayBuffer 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase32(base32: string): ArrayBuffer {
  if (base32.length % 8 !== 0)
    throw new Error('Could not decode string as Base32: Length is not a multiple of 8')

  // --- Remove padding.
  base32 = base32.replace(/=/g, '')

  // --- Assert alphabet is base64.
  if (![...base32].every(x => base32Alphabet.includes(x)))
    throw new Error('Could not decode string as Base32: Invalid characters')

  // --- Handle decode of every 4 characters into 3 bytes.
  const bytes: number[] = []
  for (let k = 0, v = 0; k < base32.length; k += 8) {
    const c0 = base32Alphabet.indexOf(base32[k])
    const c1 = base32Alphabet.indexOf(base32[k + 1])
    const c2 = base32Alphabet.indexOf(base32[k + 2])
    const c3 = base32Alphabet.indexOf(base32[k + 3])
    const c4 = base32Alphabet.indexOf(base32[k + 4])
    const c5 = base32Alphabet.indexOf(base32[k + 5])
    const c6 = base32Alphabet.indexOf(base32[k + 6])
    const c7 = base32Alphabet.indexOf(base32[k + 7])

    // --- Set the bytes in the buffer.
    bytes[v++] = ((c0 << 3) & 0b11111000) | ((c1 >> 2) & 0b00000111)
    if (c2 === -1) continue
    bytes[v++] = ((c1 << 6) & 0b11000000) | ((c2 << 1) & 0b00111110) | ((c3 >> 4) & 0b00000001)
    if (c4 === -1) continue
    bytes[v++] = ((c3 << 4) & 0b11110000) | ((c4 >> 1) & 0b00001111)
    if (c5 === -1) continue
    bytes[v++] = ((c4 << 7) & 0b10000000) | ((c5 << 2) & 0b01111100) | ((c6 >> 3) & 0b00000011)
    if (c7 === -1) continue
    bytes[v++] = ((c6 << 5) & 0b11100000) | (c7 & 0b00011111)
  }

  // --- Copy the bytes into a new buffer.
  const bufferView = new Uint8Array(bytes)
  return bufferView.buffer
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase32('KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWO===')
    const resultUtf8 = new TextDecoder().decode(result)
    const expected = 'The quick brown fox jumps over the lazy dog'
    expect(resultUtf8).toEqual(expected)
  })

  it('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase32('JBSWY3DPFQQFO33SNRSCCIJB')
    const resultUtf8 = new TextDecoder().decode(result)
    const expected = 'Hello, World!!!'
    expect(resultUtf8).toEqual(expected)
  })

  it('should throw if the string is not a multiple of 8', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ')
    expect(shouldThrow).toThrow(Error)
  })

  it('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ!')
    expect(shouldThrow).toThrow(Error)
  })
}
