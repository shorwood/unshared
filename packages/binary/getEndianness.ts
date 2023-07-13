/**
 * Get the endianness of the current runtime.
 *
 * @returns The endianness of the runtime
 */
export function getEndianness(): 'LE' | 'BE' {
  const uint8Array = new Uint8Array([0x01, 0x02, 0x03, 0x04])
  const uint32Array = new Uint32Array(uint8Array.buffer)
  return uint32Array[0] === 0x04030201 ? 'LE' : 'BE'
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should get the endianness of the runtime', () => {
    const result = getEndianness()
    expect(result).toEqual('LE')
  })
}
