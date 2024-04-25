/**
 * Decode an UTF8-encoded string into an `ArrayBuffer`. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries. This function is the same as `TextEncoder.encode()`
 * but was included for homogeneity with the other encoding functions.
 *
 * @param value The UTF8 string to decode.
 * @returns The decoded `ArrayBuffer`.
 * @example
 *
 * // Create a UTF8 string
 * const utf8 = 'Hello, World!'
 *
 * // Decode a UTF8 string to an ArrayBuffer
 * const buffer = decodeUtf8(utf8) // <ArrayBuffer 48 65 6C 6C 6F 2C 20 57 6F 72 6C 64>
 */
export function decodeUtf8(value: string): Uint8Array {
  return new TextEncoder().encode(value)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should decode a UTF8 string into a buffer', () => {
    const result = decodeUtf8('Hello, World!')
    const buffer = Buffer.from(result).toString()
    expect(buffer).toBe('Hello, World!')
  })
}
