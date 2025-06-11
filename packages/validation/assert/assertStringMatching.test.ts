import { attempt } from '@unshared/functions'
import { assertStringMatching } from './assertStringMatching'

describe('assertStringMatching', () => {
  describe('pass', () => {
    it('should pass if string matches the pattern', () => {
      const result = assertStringMatching(/Hello, \w+!/)('Hello, World!')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string does not match the pattern', () => {
      const shouldThrow = () => assertStringMatching(/Hello, \w+!/)('Hi, World!')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MATCHING',
        message: String.raw`String does not match the regular expression: /Hello, \w+!/.`,
        context: { value: 'Hi, World!', pattern: /Hello, \w+!/ },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringMatching(/Hello, \w+!/)(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer string type', () => {
      const value = 'Hello, World!' as unknown
      const assertPattern: (value: unknown) => asserts value is string = assertStringMatching(/Hello, \w+!/)
      assertPattern(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
