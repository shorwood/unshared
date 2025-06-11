import { attempt } from '@unshared/functions'
import { assertStringStartingWith } from './assertStringStartingWith'

describe('assertStringStartingWith', () => {
  describe('pass', () => {
    it('should pass if string starts with the expected prefix', () => {
      const result = assertStringStartingWith('Hello')('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string does not start with the expected prefix', () => {
      const shouldThrow = () => assertStringStartingWith('Hello')('Hi, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_STARTING_WITH',
        message: 'String does not start with "Hello".',
        context: { value: 'Hi, World!', start: 'Hello' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringStartingWith('Hello')(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer string starting with prefix', () => {
      const value = 'Hello, World!' as unknown
      const assertHello: (value: unknown) => asserts value is `Hello${string}` = assertStringStartingWith('Hello')
      assertHello(value)
      expectTypeOf(value).toEqualTypeOf<`Hello${string}`>()
    })
  })
})
