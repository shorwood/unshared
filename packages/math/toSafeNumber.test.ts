import { toSafeNumber } from './toSafeNumber'

describe('toSafeNumber', () => {
  test('should return zero when the value is NaN', () => {
    const result = toSafeNumber(Number.NaN)
    expect(result).toBe(0)
  })

  test('should return Number.MAX_SAFE_INTEGER when the value is greater than Number.MAX_SAFE_INTEGER', () => {
    const result = toSafeNumber(Number.MAX_SAFE_INTEGER + 1)
    expect(result).toStrictEqual(Number.MAX_SAFE_INTEGER)
  })

  test('should return Number.MIN_SAFE_INTEGER when the value is less than Number.MIN_SAFE_INTEGER', () => {
    const result = toSafeNumber(Number.MIN_SAFE_INTEGER - 1)
    expect(result).toStrictEqual(Number.MIN_SAFE_INTEGER)
  })

  test('should return numbers as is', () => {
    const result = toSafeNumber(5)
    expect(result).toBe(5)
  })

  test('should throw a TypeError if the input is not a number', () => {
    // @ts-expect-error: This is intentionally passing an undefined value
    const shouldThrow = () => toSafeNumber()
    expect(shouldThrow).toThrow(TypeError)
    expect(shouldThrow).toThrow('Expected a number')
  })
})
