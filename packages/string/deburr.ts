/**
 * Removes diacritics from a string.
 *
 * @param value The string to deburr.
 * @returns  The deburred string.
 * @example deburr('José piña') // => 'Jose pina'
 */
export function deburr(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Replace all Unicode characters by their ASCII counterpart.
  return value.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should discard diacritics', () => {
    const result = deburr('Jöse pîña')
    expect(result).toEqual('Jose pina')
  })

  it('should keep non-latin (e.g. Greek) characters', () => {
    const result = deburr('Γειά σου κόσμε')
    expect(result).toEqual('Γεια σου κοσμε')
  })

  it('should keep non-latin (e.g. Chinese) characters', () => {
    const result = deburr('你好世界')
    expect(result).toEqual('你好世界')
  })

  it('should keep non-language (e.g. emoji) characters', () => {
    const result = deburr('👋🌍')
    expect(result).toEqual('👋🌍')
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => deburr(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
