import { truncate } from './truncate'

describe('truncate', () => {
  describe('without options', () => {
    it('should not truncate a string that is shorter than the specified length', () => {
      const result = truncate('Hello, world!', 100)
      expect(result).toBe('Hello, world!')
    })

    it('should truncate a string to a specified length without breaking words', () => {
      const result = truncate('Hello, world!', 10)
      expect(result).toBe('Hello,')
    })
  })

  describe('with options', () => {
    it('should truncate a string to a specified length and break words', () => {
      const result = truncate('Hello, world!', { breakWords: true, length: 10 })
      expect(result).toBe('Hello, wor')
    })

    it('should truncate a string to a specified length with a custom ellipsis', () => {
      const result = truncate('Hello, world!', { ellipsis: '_', length: 10 })
      expect(result).toBe('Hello,_')
    })

    it('should truncate a single word with a custom ellipsis', () => {
      const result = truncate('Hello', { ellipsis: '_', length: 3 })
      expect(result).toBe('He_')
    })
  })

  describe('error handling', () => {
    it('should throw and error when the ellipsis is longer than the length', () => {
      const shouldThrow = () => truncate('Hello, world!', { ellipsis: '.....', length: 5 })
      expect(shouldThrow).toThrow(RangeError)
      expect(shouldThrow).toThrow('The ellipsis must be shorter than the length.')
    })

    it('should throw a type error when the length is negative', () => {
      const shouldThrow = () => truncate('Hello, World!', -1)
      expect(shouldThrow).toThrow(RangeError)
      expect(shouldThrow).toThrow('The length must be a positive integer.')
    })

    it('should throw a type error when the length is a float', () => {
      const shouldThrow = () => truncate('Hello, World!', 1.1)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('The length must be a safe integer.')
    })
  })
})
