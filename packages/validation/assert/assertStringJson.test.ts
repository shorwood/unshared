import { attempt } from '@unshared/functions'
import { assertStringJson } from './assertStringJson'

describe('assertStringJson', () => {
  describe('pass', () => {
    it('should pass if string is valid JSON object', () => {
      const result = assertStringJson('{"foo": "bar"}')
      expect(result).toBeUndefined()
    })

    it('should pass if string is valid JSON array', () => {
      const result = assertStringJson('[1, 2, 3]')
      expect(result).toBeUndefined()
    })

    it('should pass if string is valid JSON string', () => {
      const result = assertStringJson('"hello"')
      expect(result).toBeUndefined()
    })

    it('should pass if string is valid JSON number', () => {
      const result = assertStringJson('42')
      expect(result).toBeUndefined()
    })

    it('should pass if string is valid JSON boolean', () => {
      const result = assertStringJson('true')
      expect(result).toBeUndefined()
    })

    it('should pass if string is valid JSON null', () => {
      const result = assertStringJson('null')
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if string is invalid JSON', () => {
      const shouldThrow = () => assertStringJson('{"invalid": json}')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_JSON',
        message: 'String is not valid JSON.',
      })
    })

    it('should throw if string has unclosed braces', () => {
      const shouldThrow = () => assertStringJson('{"unclosed": "brace"')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_JSON',
        message: 'String is not valid JSON.',
      })
    })

    it('should throw if string has trailing commas', () => {
      const shouldThrow = () => assertStringJson('{"trailing": "comma",}')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_JSON',
        message: 'String is not valid JSON.',
      })
    })

    it('should throw if value is not a string', () => {
      const shouldThrow = () => assertStringJson({ foo: 'bar' } as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: { foo: 'bar' }, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate value as a JSON string', () => {
      const value: unknown = '{"foo": "bar"}'
      assertStringJson(value)
      expectTypeOf(value).toEqualTypeOf<string>()
    })
  })
})
