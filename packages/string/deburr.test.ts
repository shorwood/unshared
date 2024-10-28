import { deburr } from './deburr'

describe('deburr', () => {
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
})
