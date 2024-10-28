import { attempt } from '@unshared/functions'
import { assertArrayNotEmpty } from './assertArrayNotEmpty'

describe('assertArrayNotEmpty', () => {
  describe('pass', () => {
    it('should pass if value is a non-empty array', () => {
      const result = assertArrayNotEmpty([1])
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is an empty array', () => {
      const shouldThrow = () => assertArrayNotEmpty([])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_EMPTY',
        message: 'Array is empty.',
        context: { value: [] },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayNotEmpty({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a non-empty array', () => {
      const value: unknown = [1]
      assertArrayNotEmpty(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })
  })
})
