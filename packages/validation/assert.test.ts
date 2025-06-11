import { attempt } from '@unshared/functions'
import { assert } from './assert'
import { AssertionError } from './createAssertionError'

describe('assert', () => {
  it('should assert a string', () => {
    const result = assert.string('test')
    expect(result).toBeUndefined()
  })

  it('should throw an error for a non-string value', () => {
    const shouldThrow = () => assert.string(123)
    const { error } = attempt(shouldThrow)
    expect(error).toBeInstanceOf(AssertionError)
    expect(error).toMatchObject({
      name: 'E_NOT_STRING',
      message: 'Value is not a string.',
      context: { value: 123, received: 'number' },
    })
  })

  it('should allow custom error properties', () => {
    const customCause = new Error('Custom cause')
    const fn = assert.stringStartingWith
      .withName('E_CUSTOM_ERROR')
      .withCause(customCause)
      .withContext({ value: 123, received: 'number' })
      .withMessage('Custom error message')
    const shouldThrow = () => fn('test')(123)
    const { error } = attempt(shouldThrow)
    expect(error).toBeInstanceOf(AssertionError)
    expect(error).toMatchObject({
      name: 'E_CUSTOM_ERROR',
      message: 'Custom error message',
      cause: customCause,
      context: { value: 123, received: 'number' },
    })
  })
})
