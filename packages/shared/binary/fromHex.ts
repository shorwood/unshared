/**
 * Convert an hexadecimal string to an ArrayBuffer
 * @param {string} value The string to convert
 * @returns {ArrayBuffer} The converted string
 * @throws If value is not a hexadecimal string
 * @example
 * fromHex('00002F') // ArrayBuffer([0x00, 0x00, 0x2f])
 * fromHex('80ffab') // ArrayBuffer([0x80, 0xff, 0xab])
 */
export const fromHex = (value: string): ArrayBuffer => {
  // --- Check if string is valid
  if (typeof value !== 'string') throw new Error('Value must be a string')
  if (value.length % 2 !== 0) throw new Error('String must have a length that is a multiple of 2')
  if (value.slice(0, 2) === '0x') value = value.slice(2)
  if (!/^[\da-f]*$/i.test(value)) throw new Error('String must only contain hexadecimal digits')

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
