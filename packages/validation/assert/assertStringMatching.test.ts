import { attempt } from '@unshared/functions'
import { assertStringMatching } from './assertStringMatching'

describe('assertStringMatching', () => {
  describe('pass', () => {
    it('should pass if value matches the regular expression', () => {
      const result = assertStringMatching('Hello, World!', /Hello, \w+!/)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value does not match the regular expression', () => {
      const shouldThrow = () => assertStringMatching('Hello, World!', /Hello, \d+!/)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MATCHING',
        message: String.raw`String does not match the regular expression: /Hello, \d+!/.`,
        context: { value: 'Hello, World!', pattern: /Hello, \d+!/ },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringMatching({}, /Hello, \w+!/)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a string', () => {
      const value: unknown = 'Hello, World!'
      assertStringMatching(value, /Hello, \w+!/)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
