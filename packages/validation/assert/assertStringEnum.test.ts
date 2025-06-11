import { attempt } from '@unshared/functions'
import { assertStringEnum } from './assertStringEnum'

describe('assertStringEnum', () => {
  describe('pass', () => {
    it('should pass if string is one of the expected values', () => {
      const result = assertStringEnum('foo', 'bar')('foo')
      expect(result).toBeUndefined()
    })

    it('should pass if string is one of the expected values with an array', () => {
      const result = assertStringEnum(['foo', 'bar'])('bar')
      expect(result).toBeUndefined()
    })

    it('should pass if string is one of the expected values with a union type', () => {
      const result = assertStringEnum('foo', ['bar'] as const)('bar')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string is not one of the expected values', () => {
      const shouldThrow = () => assertStringEnum(['foo', 'bar'])('baz')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ONE_OF_VALUES',
        message: 'String is not one of the values: \'foo\', \'bar\'.',
        context: { value: 'baz', values: ['foo', 'bar'] },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEnum(['foo', 'bar'])(123 as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('inference', () => {
    it('should infer string enum type', () => {
      const value = 'foo' as unknown
      const assertEnum: (value: unknown) => asserts value is 'bar' | 'foo' = assertStringEnum(['foo', 'bar'])
      assertEnum(value)
      expectTypeOf(value).toEqualTypeOf<'bar' | 'foo'>()
    })
  })
})
