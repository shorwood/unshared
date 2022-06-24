/**
 * Convert an hexadecimal string to an ArrayBuffer
 * @param {string} value The string to convert
 * @returns {ArrayBuffer} The converted string
 */
export const fromHex = (value: string): ArrayBuffer => {
  // --- Check if string is valid
  if (value.length % 2 !== 0) throw new Error('Value must be a valid hex string')
  if (value.slice(0, 2) === '0x') value = value.slice(2)
  if (!/^[\da-f]*$/i.test(value)) throw new Error('Value must contain only hexadecimal digits')

  // --- Convert the string
  const arrayBuffer = new ArrayBuffer(value.length / 2)
  const uint8Array = new Uint8Array(arrayBuffer)

  // --- Parse bytes.
  for (let index = 0; index < value.length; index += 2) {
    const charCode = Number.parseInt(value.slice(index, index + 2), 16)
    uint8Array[index / 2] = charCode
  }

  // --- Return ArrayBuffer.
  return arrayBuffer
}
