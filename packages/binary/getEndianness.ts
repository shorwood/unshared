/**
 * Get the endianness of the current environment. This is useful for converting
 * between big-endian and little-endian byte order when working in multi-architectural
 * environments.
 *
 * @returns The endianness of the runtime.
 * @example getEndianness() // 'LE'
 */
export function getEndianness(): 'BE' | 'LE' {
  const uint8Array = new Uint8Array([0x01, 0x02, 0x03, 0x04])
  const uint32Array = new Uint32Array(uint8Array.buffer)
  return uint32Array[0] === 0x04030201 ? 'LE' : 'BE'
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should get the endianness of the runtime', () => {
    const result = getEndianness()
    expect(result).toEqual('LE')
  })
}
