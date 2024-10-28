import { attempt } from '@unshared/functions'
import { assertStringEnum } from './assertStringEnum'

describe('assertStringEnum', () => {
  describe('pass', () => {
    it('should pass if value is one of the values', () => {
      const result = assertStringEnum('Hello, World!', ['Hello, World!', 'Hello, Universe!'])
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if value is not one of the values', () => {
      const shouldThrow = () => assertStringEnum('Hello, World!', ['Hello, Universe!'])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_ONE_OF_VALUES',
        message: 'String is not one of the values: \'Hello, Universe!\'.',
        context: { value: 'Hello, World!', values: ['Hello, Universe!'] },
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringEnum({}, ['Hello, World!'])
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
      assertStringEnum(value, ['Hello, World!', 'Hello, Universe!'])
      expectTypeOf(value).toEqualTypeOf<'Hello, Universe!' | 'Hello, World!'>()
    })
  })
})
