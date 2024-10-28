import { floor } from './floor'

describe('floor', () => {
  test('should floor an integer', () => {
    const result = floor(1)
    expect(result).toBe(1)
  })

  test('should floor a number', () => {
    const result = floor(1.234)
    expect(result).toBe(1)
  })

  test('should floor a number to a given precision', () => {
    const result = floor(1.234, 2)
    expect(result).toStrictEqual(1.23)
  })

  test('should throw an error if the precision is negative', () => {

    // @ts-expect-error: Precision is negative
    const shouldThrow = () => floor(1.234, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw an error if the precision is not an integer', () => {

    // @ts-expect-error: Precision is not an integer
    const shouldThrow = () => floor(1.234, 1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
})
