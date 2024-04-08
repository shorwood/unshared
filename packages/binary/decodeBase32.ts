import { B32 } from './encodeBase32'

/** Regular expression to test if a string is a valid Base32 string. */
const BASE_32_REGEXP = /^[2-7a-z]+=*$/i

/**
 * Decode a Base32-encoded string into an `Uint8Array`. Since this implementation is
 * using the native `Uint8Array` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param value The Base32 string to decode.
 * @returns The decoded `Uint8Array`.
 * @example
 *
 * // Create a Base32 string
 * const base32 = 'KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWO==='
 *
 * // Decode a Base32 string to an Uint8Array
 * const buffer = decodeBase32(base32) // <Uint8Array 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 *
 * // Get the string from the buffer
 * const string = new TextDecoder().decode(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function decodeBase32(value: string): Uint8Array {
  if (value.length % 8 !== 0)
    throw new Error('Could not decode string as Base32: Length is not a multiple of 8')
  if (BASE_32_REGEXP.test(value) === false)
    throw new Error('Could not decode string as Base32: Invalid characters')

  // --- Handle decode of every 8 characters into 5 bytes.
  const result: number[] = []
  for (let k = 0, v = 0; k < value.length; k += 8) {
    const c0 = B32.indexOf(value[k])
    const c1 = B32.indexOf(value[k + 1])
    const c2 = B32.indexOf(value[k + 2])
    const c3 = B32.indexOf(value[k + 3])
    const c4 = B32.indexOf(value[k + 4])
    const c5 = B32.indexOf(value[k + 5])
    const c6 = B32.indexOf(value[k + 6])
    const c7 = B32.indexOf(value[k + 7])

    // --- Set the bytes in the buffer.
    result[v++] = ((c0 << 3) & 0b11111000) | ((c1 >> 2) & 0b00000111)
    if (c2 === -1) continue
    result[v++] = ((c1 << 6) & 0b11000000) | ((c2 << 1) & 0b00111110) | ((c3 >> 4) & 0b00000001)
    if (c4 === -1) continue
    result[v++] = ((c3 << 4) & 0b11110000) | ((c4 >> 1) & 0b00001111)
    if (c5 === -1) continue
    result[v++] = ((c4 << 7) & 0b10000000) | ((c5 << 2) & 0b01111100) | ((c6 >> 3) & 0b00000011)
    if (c7 === -1) continue
    result[v++] = ((c6 << 5) & 0b11100000) | (c7 & 0b00011111)
  }

  // --- Return as Buffer
  return new Uint8Array(result)
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { encodeUtf8 } = await import('./encodeUtf8')

  it('should decode a Base64 encoded string with padding into a buffer', () => {
    const result = decodeBase32('JBSWY3DPFQQFO33SNRSCC===')
    const string = encodeUtf8(result)
    expect(string).toEqual('Hello, World!')
  })

  it('should decode a Base64 encoded string without padding into a buffer', () => {
    const result = decodeBase32('JBSWY3DPFQQFO33SNRSCCIJB')
    const string = encodeUtf8(result)
    expect(string).toEqual('Hello, World!!!')
  })

  it('should throw if the string is not a multiple of 8', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ')
    expect(shouldThrow).toThrow('Could not decode string as Base32: Length is not a multiple of 8')
  })

  it('should throw if the string contains invalid characters', () => {
    const shouldThrow = () => decodeBase32('JBSWY3DPFQQFO33SNRSCCIJ#')
    expect(shouldThrow).toThrow('Could not decode string as Base32: Invalid characters')
  })
}
