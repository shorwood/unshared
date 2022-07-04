/**
 * Convert an UTF8 string to an ArrayBuffer
 * @param {string} value The string to convert
 * @returns {ArrayBuffer} The converted string
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
