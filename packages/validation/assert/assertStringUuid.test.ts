import type { UUID } from 'node:crypto'
import { attempt } from '@unshared/functions'
import { assertStringUuid } from './assertStringUuid'

describe('assertStringUuid', () => {
  describe('pass', () => {
    it('should pass if value is a UUID', () => {
      const result = assertStringUuid('00000000-0000-0000-0000-000000000000')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not a UUID', () => {
      const shouldThrow = () => assertStringUuid('not-a-uuid')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_UUID',
        message: 'String is not a UUID.',
        context: { value: 'not-a-uuid' },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringUuid(1)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 1, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a UUID', () => {
      const value: unknown = '00000000-0000-0000-0000-000000000000'
      assertStringUuid(value)
      expectTypeOf(value).toEqualTypeOf<UUID>()
    })
  })
})
