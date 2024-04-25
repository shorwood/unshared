import { B16 } from './constants'

/** Regular expression to test if a string is a valid Base16 string. */
const BASE_16_REGEXP = /^[\da-f]+$/i

/**
 * Decode a Base16-encoded string into an `Uint8Array`. Since this implementation is
 * using the native `Uint8Array` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param value The Base16 string to decode.
 * @returns The decoded `Uint8Array`.
 * @example
 *
 * // Create a Base16 string
 * const string = 'KRUGKIDROVUWG2ZAMJZG653OEBTG66BANJ2W24DTEBXXMZLSEB2GQZJANRQXU6JAMRXWO==='
 *
 * // Decode a Base16 string to an Uint8Array
 * const buffer = decodeBase16(string) // <Uint8Array 54 68 65 20 71 75 69 63 6b 20 62 72 ...>
 */
export function decodeBase16(value: string): Uint8Array {
  if (value.length % 2 !== 0)
    throw new Error('Could not decode string as Base16: Length is not a multiple of 2')
  if (BASE_16_REGEXP.test(value) === false)
    throw new Error('Could not decode string as Base16: Invalid characters')

  // --- Convert to lowercase
  value = value.toLowerCase()

  // --- Decode every 2 characters into 1 byte.
  const result = new Uint8Array(value.length / 2)
  for (let i = 0, offset = 0; i < value.length; i += 2) {
    const c0 = B16.indexOf(value[i])
    const c1 = B16.indexOf(value[i + 1])
    result[offset++] = c0 << 4 | c1
  }

  // --- Return as Buffer
  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { encodeUtf8 } = await import('./encodeUtf8')

  test('should decode uppercase hexadecimal string into a buffer', () => {
    const result = decodeBase16('48656C6C6F2C20576F726C6421')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should decode lowercase hexadecimal string into a buffer', () => {
    const result = decodeBase16('48656c6c6f2c20576f726c6421')
    const string = encodeUtf8(result)
    expect(string).toBe('Hello, World!')
  })

  test('should throw if the string is not a multiple of 2', () => {
    const shouldThrow = () => decodeBase16('123')
    expect(shouldThrow).toThrow('Could not decode string as Base16: Length is not a multiple of 2')
  })

  test('should throw if the string contains non-hexadecimal characters', () => {
    const shouldThrow = () => decodeBase16('0G')
    expect(shouldThrow).toThrow('Could not decode string as Base16: Invalid characters')
  })
}
