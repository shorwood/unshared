/**
 * Removes diacritics from a string.
 *
 * @param value The string to deburr.
 * @returns  The deburred string.
 * @example deburr('José piña') // => 'Jose pina'
 */
export function deburr(value: string): string {
  return value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should replace diacritics', () => {
    const result = deburr('Jöse pîña')
    expect(result).toBe('Jose pina')
  })

  test('should strip combining diacritics', () => {
    const result = deburr('a̐éö̲')
    expect(result).toBe('aeo')
  })

  test('should keep non-latin (e.g. Greek) characters', () => {
    const result = deburr('Γειά σου κόσμε')
    expect(result).toBe('Γεια σου κοσμε')
  })

  test('should keep non-latin (e.g. Chinese) characters', () => {
    const result = deburr('你好世界')
    expect(result).toBe('你好世界')
  })

  test('should keep non-language (e.g. emoji) characters', () => {
    const result = deburr('👋🌍')
    expect(result).toBe('👋🌍')
  })
}
