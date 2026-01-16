import { binaryFromName, isName, NAMES } from './name'

describe('name', () => {
  describe('NAMES', () => {
    it.each(Object.keys(NAMES))('should contain standard color names', (name) => {
      const result = NAMES[name as keyof typeof NAMES]
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0x000000)
      expect(result).toBeLessThanOrEqual(0xFFFFFF)
    })
  })

  describe('isName', () => {
    it.each(Object.keys(NAMES))('should return true for valid color name: %s', (name) => {
      const result = isName(name)
      expect(result).toBe(true)
    })

    it('should return false for invalid color names', () => {
      const result = isName('notacolor')
      expect(result).toBe(false)
    })
  })

  describe('binaryFromName', () => {
    it.each(Object.entries(NAMES))('should return correct hex value for color name: %s', (name, expected) => {
      const result = binaryFromName(name as keyof typeof NAMES)
      expect(result).toBe(expected)
    })

    it('should return undefined for invalid color name', () => {
      const result = binaryFromName('notacolor' as keyof typeof NAMES)
      expect(result).toBeUndefined()
    })
  })
})
