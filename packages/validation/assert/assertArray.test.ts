import { attempt } from '@unshared/functions'
import { assertArray } from './assertArray'

describe('assertArray', () => {
  describe('pass', () => {
    it('should pass if value is an array', () => {
      const result = assertArray([])
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is an object', () => {
      const shouldThrow = () => assertArray({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is undefined', () => {
      const shouldThrow = () => assertArray(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: undefined, received: 'undefined' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertArray(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an array', () => {
      const value = [] as unknown
      assertArray(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })

    it('should predicate an array of string if a generic is provided', () => {
      const value = [] as unknown
      assertArray<string>(value)
      expectTypeOf(value).toEqualTypeOf<string[]>()
    })
  })
})
