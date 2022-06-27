
/**
 * Get the endianness of the current runtime
 * @warning Prefer `endianness` over this function as the result won't change.
 * @returns {string} The endianness of the runtime
 */
export const getEndianness = (): 'LE' | 'BE' => {
  const uint8Array = new Uint8Array([0x01, 0x02, 0x03, 0x04])
  const uint32Array = new Uint32Array(uint8Array.buffer)
  return uint32Array[0] === 0x04030201 ? 'LE' : 'BE'
}

/** Endianness of the current runtime. */
export const endianness = getEndianness()

/** Current runtime is little-endien. */
export const isLittleEndian = endianness === 'LE'

/** Current runtime is big-endien. */
export const isBigEndian = endianness === 'BE'
