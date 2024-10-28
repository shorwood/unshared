import { attempt } from '@unshared/functions'
import { assertArrayEmpty } from './assertArrayEmpty'

describe('assertArrayEmpty', () => {
  describe('pass', () => {
    it('should pass if value is an empty array', () => {
      const result = assertArrayEmpty([])
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an empty array', () => {
      const shouldThrow = () => assertArrayEmpty([1])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_NOT_EMPTY',
        message: 'Array is not empty.',
        context: { value: [1], length: 1 },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayEmpty({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an empty array', () => {
      const value: unknown = []
      assertArrayEmpty(value)
      expectTypeOf(value).toEqualTypeOf<[]>()
    })
  })
})
