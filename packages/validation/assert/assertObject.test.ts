import type { ObjectLike } from '@unshared/types'
import { attempt } from '@unshared/functions'
import { assertObject } from './assertObject'

describe('assertObject', () => {
  describe('pass', () => {
    it('should pass if value is an object-like', () => {
      const result = assertObject({})
      expect(result).toBeUndefined()
    })

    it('should pass if value is an array', () => {
      const result = assertObject([])
      expect(result).toBeUndefined()
    })

    it('should pass if value is an instance of a class', () => {
      const result = assertObject(new Date())
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is null', () => {
      const shouldThrow = () => assertObject(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an object-like', () => {
      const value: unknown = {}
      assertObject(value)
      expectTypeOf(value).toEqualTypeOf<ObjectLike>()
    })
  })
})
