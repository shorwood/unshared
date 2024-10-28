import { range } from './range'

describe('range', () => {
  test('should create a range of numbers', () => {
    const result = range(0, 5)
    expect(result).toStrictEqual([0, 1, 2, 3, 4])
  })

  test('should create a range of numbers with a step', () => {
    const result = range(0, 10, 2)
    expect(result).toStrictEqual([0, 2, 4, 6, 8])
  })

  test('should create a range of numbers with a negative step', () => {
    const result = range(10, 0, -2)
    expect(result).toStrictEqual([10, 8, 6, 4, 2])
  })

  test('should throw an error if the step is positive and the start is greater than the end', () => {
    const shouldThrow = () => range(10, 0, 2)
    expect(shouldThrow).toThrow(Error)
  })

  test('should throw an error if the step is negative and the start is less than the end', () => {
    const shouldThrow = () => range(0, 10, -2)
    expect(shouldThrow).toThrow(Error)
  })
})
