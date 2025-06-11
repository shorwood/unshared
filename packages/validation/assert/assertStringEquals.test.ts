import { attempt } from '@unshared/functions'
import { assertStringEquals } from './assertStringEquals'

describe('assertStringEquals', () => {
  describe('pass', () => {
    it('should pass if string equals the expected value', () => {
      const result = assertStringEquals('Hello, World!')('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string does not equal the expected value', () => {
      const shouldThrow = () => assertStringEquals('Hello, World!')('Hello, Universe!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_EQUAL',
        message: 'String is not equal to "Hello, World!".',
        context: { value: 'Hello, Universe!', expected: 'Hello, World!' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEquals('Hello, World!')(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer the exact string literal type', () => {
      const value = 'Hello, World!' as unknown
      const assertEqual: (value: unknown) => asserts value is 'Hello, World!' = assertStringEquals('Hello, World!')
      assertEqual(value)
      expectTypeOf(value).toEqualTypeOf<'Hello, World!'>()
    })
  })
})
