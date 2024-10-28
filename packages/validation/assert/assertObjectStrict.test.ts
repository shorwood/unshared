import type { ObjectLike } from '@unshared/types'
import { attempt } from '@unshared/functions'
import { assertObjectStrict } from './assertObjectStrict'

describe('assertObjectStrict', () => {
  describe('pass', () => {
    it('should pass if value is an object', () => {
      const result = assertObjectStrict({})
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not an object', () => {
      const shouldThrow = () => assertObjectStrict([])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT_STRICT',
        message: 'Value is not strictly an object.',
        context: { value: [], received: 'Array' },
      })
    })

    it('should throw if value is an array', () => {
      const shouldThrow = () => assertObjectStrict([])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT_STRICT',
        message: 'Value is not strictly an object.',
        context: { value: [], received: 'Array' },
      })
    })

    it('should throw if value is an instance of a class', () => {
      const shouldThrow = () => assertObjectStrict(new RegExp(/Hello/))
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT_STRICT',
        message: 'Value is not strictly an object.',
        context: { value: new RegExp(/Hello/), received: 'RegExp' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertObjectStrict(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_OBJECT',
        message: 'Value is not an object.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as an object', () => {
      const value: unknown = {}
      assertObjectStrict(value)
      expectTypeOf(value).toEqualTypeOf<ObjectLike>()
    })
  })
})
