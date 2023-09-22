/**
 * Encode a `ArrayBuffer` to an UTF-8 encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The UTF-8 encoded string.
 * @example
 *
 * // Create a buffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the buffer into UTF-8.
 * encodeUtf8(buffer) // 'The quick brown fox jumps over the lazy dog'
 */
export function encodeUtf8(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer)
  const result: string[] = []
  for (const element of view) {
    const char = String.fromCharCode(element)
    result.push(char)
  }
  return result.join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should encode a buffer into a UTF-8 string and omit padding', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeUtf8(buffer)
    expect(result).toEqual('Hello, World!')
  })
}
