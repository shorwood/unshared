import { base64Symbols } from './fromBase64'

/**
 * Convert an ArrayBuffer to a Base64-encoded string.
 * @param {ArrayBuffer} buffer The ArrayBuffer to convert
 * @returns {string} The Base64-encoded string
 */
export const toBase64 = (buffer: ArrayBuffer): string => {
  // --- Instantiate DataView
  const view = new DataView(buffer)

  // --- Initialize result variable
  let result = ''

  // --- Loop over every byte in the ArrayBuffer
  for (let index = 2; index < view.byteLength; index += 3) {
    // --- Get the 3 bytes as an 8-bit integer
    const byte1 = view.getUint8(index - 2)
    const byte2 = view.getUint8(index - 1)
    const byte3 = view.getUint8(index)

    // --- Convert the 3 bytes into 4 Base64 characters
    const char1 = ((byte1 >> 2) & 0b00111111)
    const char2 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const char3 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const char4 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    result += base64Symbols[char1]
    result += base64Symbols[char2]
    result += base64Symbols[char3]
    result += base64Symbols[char4]
  }

  // --- Handle special case where length is not a multiple of 3
  const remainder = view.byteLength % 3
  if (remainder === 1) {
    const byte1 = view.getUint8(view.byteLength - 1)
    const char1 = (byte1 >> 2) & 0b00111111
    const char2 = (byte1 << 4) & 0b00110000
    result += base64Symbols[char1]
    result += base64Symbols[char2]
    result += '=='
  }
  else if (remainder === 2) {
    const byte1 = view.getUint8(view.byteLength - 2)
    const byte2 = view.getUint8(view.byteLength - 1)
    const char1 = ((byte1 >> 2) & 0b00111111)
    const char2 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const char3 = ((byte2 << 2) & 0b00111100)
    result += base64Symbols[char1]
    result += base64Symbols[char2]
    result += base64Symbols[char3]
    result += '='
  }

  // --- Return the result
  return result
}
