import { attempt } from '@unshared/functions'
import { assertStringUppercase } from './assertStringUppercase'

describe('assertStringUppercase', () => {
  describe('pass', () => {
    it('should pass if string is in uppercase', () => {
      const result = assertStringUppercase('HELLO WORLD')
      expect(result).toBeUndefined()
    })

    it('should pass if string contains numbers and uppercase letters', () => {
      const result = assertStringUppercase('HELLO123WORLD')
      expect(result).toBeUndefined()
    })

    it('should pass if string contains special characters and uppercase letters', () => {
      const result = assertStringUppercase('HELLO-WORLD_TEST')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string contains lowercase letters', () => {
      const shouldThrow = () => assertStringUppercase('Hello World')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_UPPERCASE',
        message: 'String is not in uppercase.',
        context: { value: 'Hello World' },
      })
    })

    it('should throw if string is all lowercase', () => {
      const shouldThrow = () => assertStringUppercase('hello world')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_UPPERCASE',
        message: 'String is not in uppercase.',
        context: { value: 'hello world' },
      })
    })

    it('should throw if string is empty', () => {
      const shouldThrow = () => assertStringUppercase('')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_EMPTY',
        message: 'String is empty.',
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringUppercase(123)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
      })
    })
  })

  describe('inference', () => {
    it('should predicate an uppercase string', () => {
      const value = 'HELLO WORLD' as unknown
      assertStringUppercase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
