/* eslint-disable unicorn/prevent-abbreviations */
export const base64Symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Convert a Base64 string to an ArrayBuffer
 * @param {string} value The Base64 string to convert
 * @returns {ArrayBuffer} The converted ArrayBuffer
 */
export const fromBase64 = (value: string): ArrayBuffer => {
  // --- Check if string is valid
  if (value.length % 4 !== 0) throw new Error('Value must be a valid base64 string')
  if (!/^[\d+/=a-z]*$/i.test(value)) throw new Error('Value must contain only base64 digits')
  value = value.replace(/=/g, '')

  // --- Initialize buffer
  const buffer = new ArrayBuffer(value.length / 4 * 3)
  const bufferView = new Uint8Array(buffer)

  // --- Handle each group of 4 characters
  for (let i = 0, j = 0; i < value.length; i += 4) {
    // --- Convert 4 characters to 3 bytes
    const bytes = [
      base64Symbols.indexOf(value[i]),
      base64Symbols.indexOf(value[i + 1]),
      base64Symbols.indexOf(value[i + 2]),
      base64Symbols.indexOf(value[i + 3]),
    ]

    // --- Skip padding
    if (bytes[2] === 64) {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
    }
    else if (bytes[3] === 64) {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
      bufferView[j++] = ((bytes[1] & 15) << 4) | (bytes[2] >> 2)
    }
    else {
      bufferView[j++] = (bytes[0] << 2) | (bytes[1] >> 4)
      bufferView[j++] = ((bytes[1] & 15) << 4) | (bytes[2] >> 2)
      bufferView[j++] = ((bytes[2] & 3) << 6) | bytes[3]
    }
  }

  // --- Return buffer.
  return buffer
}
