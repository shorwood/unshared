/**
 * Converts an `ArrayBuffer` into an hexadecimal string
 * @param {ArrayBuffer} buffer The `ArrayBuffer` to convert
 * @returns {string} The hexadecimal string
 */
export const toHex = (buffer: ArrayBuffer): string => {
  // --- Instantiate DataView
  const view = new DataView(buffer)

  // --- Convert ArrayBuffer to string
  const hexes: string[] = []
  for (let offset = 0; offset < buffer.byteLength; offset++)
    hexes.push(view.getUint8(offset).toString(16).padStart(2, '0'))

  // --- Return result
  return hexes.join('')
}
