import type { Function } from '@unshared/types'
import { attempt } from '@unshared/functions'
import { assertFunction } from './assertFunction'

describe('assertFunction', () => {
  describe('pass', () => {
    it('should pass if value is a function', () => {
      const result = assertFunction(() => {})
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a function', () => {
      const shouldThrow = () => assertFunction({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_FUNCTION',
        message: 'Value is not a function.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a function', () => {
      const value: unknown = () => { /* noop */ }
      assertFunction(value)
      expectTypeOf(value).toEqualTypeOf<Function>()
    })
  })
})
