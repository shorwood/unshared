import { ceil } from './ceil'

describe('ceil', () => {
  test('should ceil an integer', () => {
    const result = ceil(1)
    expect(result).toBe(1)
  })

  test('should ceil a number', () => {
    const result = ceil(1.234)
    expect(result).toBe(2)
  })

  test('should ceil a number to a given precision', () => {
    const result = ceil(1.234, 2)
    expect(result).toStrictEqual(1.24)
  })

  test('should throw an error if the precision is negative', () => {

    // @ts-expect-error: Precision is negative
    const shouldThrow = () => ceil(1.234, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw an error if the precision is not an integer', () => {

    // @ts-expect-error: Precision is not an integer
    const shouldThrow = () => ceil(1.234, 1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
})
