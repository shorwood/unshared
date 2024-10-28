import { wrapAssert } from './wrapAssert'

describe('wrapAssert', () => {
  const assertString = (value: unknown): asserts value is string => {
    if (typeof value === 'string') return
    throw new Error('Expected value to be a string.')
  }

  describe('default', () => {
    it('should return a proxied assert function', () => {
      const assert = wrapAssert(assertString)
      expect(assert).toBeInstanceOf(Function)
    })

    it('should return void if the assertion passes', () => {
      const assert = wrapAssert(assertString)
      const result = assert('Hello')
      expect(result).toBeUndefined()
    })

    it('should throw an error if the assertion fails', () => {
      const assert = wrapAssert(assertString)
      const shouldThrow = () => assert(5)
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Expected value to be a string.')
    })
  })

  describe('with', () => {
    it('should throw an error with a custom message', () => {
      const assert = wrapAssert(assertString)
      const shouldThrow = () => assert.with('Custom error message.')(5)
      expect(shouldThrow).toThrow(Error)
      expect(shouldThrow).toThrow('Custom error message.')
    })

    it('should throw an error with a custom error', () => {
      const assert = wrapAssert(assertString)
      const error = new TypeError('Custom error.')
      const shouldThrow = () => assert.with(error)(5)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Custom error.')
    })
  })
})
