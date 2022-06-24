let endianness: 'LE' | 'BE'

/**
 * Get the endianness of the current machine
 * @returns {string} The endianness of the machine
 */
export const getEndianness = (): 'LE' | 'BE' => {
  if (endianness) return endianness
  const uint8Array = new Uint8Array([0x01, 0x02, 0x03, 0x04])
  const uint32Array = new Uint32Array(uint8Array.buffer)
  return uint32Array[0] === 0x04030201 ? (endianness = 'LE') : (endianness = 'BE')
}
