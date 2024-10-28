import { round } from './round'

describe('round', () => {
  test('should round an integer', () => {
    const result = round(1)
    expect(result).toBe(1)
  })

  test('should round a number', () => {
    const result = round(1.234)
    expect(result).toBe(1)
  })

  test('should round a number to a given precision', () => {
    const result = round(1.234, 2)
    expect(result).toStrictEqual(1.23)
  })

  test('should throw an error if the precision is negative', () => {

    // @ts-expect-error: Precision is negative
    const shouldThrow = () => round(1.234, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw an error if the precision is not an integer', () => {

    // @ts-expect-error: Precision is not an integer
    const shouldThrow = () => round(1.234, 1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
})
