import { toNumber } from './toNumber'

describe('toNumber', () => {
  test('should cast a number to a number', () => {
    const result = toNumber(42)
    expect(result).toBe(42)
  })

  test('should cast a bigint to a number', () => {
    const result = toNumber(42n)
    expect(result).toBe(42)
  })

  test('should cast a boolean to a number', () => {
    const result = toNumber(true)
    expect(result).toBe(1)
  })

  test('should cast a string to a number', () => {
    const result = toNumber('42.0')
    expect(result).toBe(42)
  })

  test('should throw an error if the string is not a number', () => {
    const shouldThrow = () => toNumber('foo')
    expect(shouldThrow).toThrow('Cannot cast non-number string "foo" to a number.')
  })

  test('should throw an error if the value is not a number-like value', () => {
    // @ts-expect-error: Test non-number-like value
    const shouldThrow = () => toNumber({})
    expect(shouldThrow).toThrow('Cannot cast [object Object] to a number.')
  })
})
