import { attempt } from '@unshared/functions'
import { assertStringLowercase } from './assertStringLowercase'

describe('assertStringLowercase', () => {
  describe('pass', () => {
    it('should pass if string is in lowercase', () => {
      const result = assertStringLowercase('hello world')
      expect(result).toBeUndefined()
    })

    it('should pass if string contains numbers and lowercase letters', () => {
      const result = assertStringLowercase('hello123world')
      expect(result).toBeUndefined()
    })

    it('should pass if string contains special characters and lowercase letters', () => {
      const result = assertStringLowercase('hello-world_test')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string contains uppercase letters', () => {
      const shouldThrow = () => assertStringLowercase('Hello World')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_LOWERCASE',
        message: 'String is not in lowercase.',
        context: { value: 'Hello World' },
      })
    })

    it('should throw if string is all uppercase', () => {
      const shouldThrow = () => assertStringLowercase('HELLO WORLD')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_LOWERCASE',
        message: 'String is not in lowercase.',
        context: { value: 'HELLO WORLD' },
      })
    })

    it('should throw if string is empty', () => {
      const shouldThrow = () => assertStringLowercase('')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_EMPTY',
        message: 'String is empty.',
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringLowercase(123)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
      })
    })
  })

  describe('inference', () => {
    it('should predicate a lowercase string', () => {
      const value = 'hello world' as unknown
      assertStringLowercase(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
