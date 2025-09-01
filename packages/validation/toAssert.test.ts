/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Assert } from './toAssert'
import { attempt } from '@unshared/functions'
import { AssertionError } from './createAssertionError'
import { toAssert } from './toAssert'

describe('toAssert', () => {
  const assertString = (value: unknown): asserts value is string => {
    if (typeof value === 'string') return
    throw new Error('Value is not a string.')
  }

  const assertStringWithAssertionError = (value: unknown): asserts value is string => {
    if (typeof value === 'string') return
    throw new AssertionError({
      name: 'E_NOT_STRING',
      message: 'Value is not a string.',
      context: { value, received: typeof value },
    })
  }

  const assertStringStartsWith = (prefix: string) => (value: unknown): asserts value is string => {
    if (typeof value === 'string' && value.startsWith(prefix)) return
    throw new AssertionError({
      name: 'E_NOT_STRING_STARTS_WITH',
      message: `Value is not a string starting with "${prefix}".`,
      context: { value, received: typeof value, prefix },
    })
  }

  describe('basic functionality', () => {
    it('should return the original function when no wrapper methods are used', () => {
      const wrapped = toAssert(assertString)
      const result = wrapped('hello')
      expect(result).toBeUndefined()
    })

    it('should throw the AssertionError when the assertion fails', () => {
      const wrapped = toAssert(assertString)
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_ASSERTION_ERROR',
        message: 'Value is not a string.',
      })
    })

    it('should wrap function and pass through successful assertions', () => {
      const wrappedAssert = toAssert(assertString)
      const result = wrappedAssert('hello')
      expect(result).toBeUndefined()
    })
  })

  describe('withMessage', () => {
    it('should wrap error with AssertionError and custom message', () => {
      const wrapped = toAssert(assertString).withMessage('Custom error message')
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_ASSERTION_ERROR',
        message: 'Custom error message',
        cause: expect.any(Error),
      })
    })

    it('should modify the error message of AssertionError', () => {
      const wrapped = toAssert(assertStringWithAssertionError).withMessage('Custom error message')
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Custom error message',
        context: { value: 123, received: 'number' },
      })
    })

    it('should customize error message when assertion fails', () => {
      const wrappedAssert = toAssert(assertString).withMessage('Custom error message')
      const shouldThrow = () => wrappedAssert(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        message: 'Custom error message',
      })
    })
  })

  describe('withCause', () => {
    it('should wrap error with AssertionError and custom cause', () => {
      const customCause = new Error('Root cause')
      const wrapped = toAssert(assertString).withCause(customCause)
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_ASSERTION_ERROR',
        message: 'Value is not a string.',
        cause: customCause,
      })
    })

    it('should modify the cause of AssertionError', () => {
      const customCause = new Error('Root cause')
      const wrapped = toAssert(assertStringWithAssertionError).withCause(customCause)
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        cause: customCause,
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('withName', () => {
    it('should wrap error with AssertionError and custom name', () => {
      const wrapped = toAssert(assertString).withName('E_CUSTOM_ERROR')
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_CUSTOM_ERROR',
        message: 'Value is not a string.',
      })
    })

    it('should modify the name of AssertionError', () => {
      const wrapped = toAssert(assertStringWithAssertionError).withName('E_CUSTOM_ERROR')
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_CUSTOM_ERROR',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number' },
      })
    })
  })

  describe('withContext', () => {
    it('should wrap error with AssertionError and custom context', () => {
      const wrapped = toAssert(assertString).withContext({ additional: 'context' })
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_ASSERTION_ERROR',
        message: 'Value is not a string.',
        context: { additional: 'context' },
      })
    })

    it('should modify the context of AssertionError', () => {
      const wrapped = toAssert(assertStringWithAssertionError).withContext({ additional: 'context' })
      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_NOT_STRING',
        message: 'Value is not a string.',
        context: { value: 123, received: 'number', additional: 'context' },
      })
    })
  })

  describe('assertion with parameters', () => {
    it('should wrap assertion with parameters', () => {
      const wrapped = toAssert(assertStringStartsWith('test')).withName('E_CUSTOM_STARTS_WITH')
      const { error } = attempt(() => wrapped('not-test-123'))
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({ name: 'E_CUSTOM_STARTS_WITH' })
    })
  })

  describe('method chaining', () => {
    it('should allow chaining multiple wrapper methods', () => {
      const customCause = new Error('Root cause')
      const wrapped = toAssert(assertStringWithAssertionError)
        .withName('E_CUSTOM_ERROR')
        .withMessage('Custom error message')
        .withCause(customCause)
        .withContext({ additional: 'context' })

      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_CUSTOM_ERROR',
        message: 'Custom error message',
        cause: customCause,
        context: {
          value: 123,
          received: 'number',
          additional: 'context',
        },
      })
    })

    it('should chain multiple wrapper methods together', () => {
      const customError = new Error('Root cause')
      const wrappedAssert = toAssert(assertString)
        .withName('E_CUSTOM_STRING')
        .withMessage('Custom string validation failed')
        .withCause(customError)
        .withContext({ expectedType: 'string' })

      const shouldThrow = () => wrappedAssert(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_CUSTOM_STRING',
        message: 'Custom string validation failed',
        cause: customError,
        context: { expectedType: 'string' },
      })
    })

    it('should override error after initial definition', () => {
      const wrapped = toAssert(assertString)
        .withMessage('First message')
        .withMessage('Second message')
        .withName('E_FIRST_NAME')
        .withName('E_SECOND_NAME')
        .withContext({ first: 'context' })
        .withContext({ second: 'context' })

      const shouldThrow = () => wrapped(123)
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_SECOND_NAME',
        message: 'Second message',
        context: { second: 'context' },
      })
    })

    it('should preserve initial parameterization', () => {
      const wrapped = toAssert(assertStringStartsWith)
        .withMessage('Custom message')
        .withName('E_CUSTOM_NAME')('test')

      const shouldThrow = () => wrapped('no-match')
      const { error } = attempt(shouldThrow)
      expect(error).toBeInstanceOf(AssertionError)
      expect(error).toMatchObject({
        name: 'E_CUSTOM_NAME',
        message: 'Custom message',
        context: { prefix: 'test' },
      })
    })
  })

  describe('inference', () => {
    it('should maintain function type signature', () => {
      const wrapped = toAssert(assertString)
      expectTypeOf(wrapped).toEqualTypeOf<Assert<(value: unknown) => asserts value is string>>()
    })

    it('should maintain function type signature with wrapper methods', () => {
      const wrapped = toAssert(assertString).withMessage('Custom message')
      expectTypeOf(wrapped).toEqualTypeOf<Assert<(value: unknown) => asserts value is string>>()
    })
  })
})
