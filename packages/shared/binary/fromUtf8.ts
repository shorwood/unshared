/**
 * Convert an UTF8 string to an ArrayBuffer
 * @param {string} value The string to convert
 * @returns {ArrayBuffer} A new ArrayBuffer
 * @example
 * fromUtf8('Hello World') // ArrayBuffer([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64])
 * fromUtf8('こんにちは') // ArrayBuffer([0xe3, 0x81, 0x93, 0xe3, 0x82, 0x93, 0xe3, 0x81, 0xab, 0xe3, 0x81, 0xa1, 0xe3, 0x81, 0xaf])
 */
export const fromUtf8 = (value: string): ArrayBuffer => {
  // --- Create a new view on the string.
  const result = new ArrayBuffer(value.length)
  const view = new Uint8Array(result)

  // --- Convert the string to bytes.
  for (let index = 0; index < value.length; index++)
    view[index] = value.charCodeAt(index)

  // --- Return the result.
  return result
}
