import { percentile } from './percentile'

describe('percentile', () => {
  test('should compute the 25th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.25)
    expect(result).toBe(20)
  })

  test('should compute the 50th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.5)
    expect(result).toBe(30)
  })

  test('should compute the 75th percentile of a set of numbers', () => {
    const result = percentile([10, 20, 30, 40, 50], 0.75)
    expect(result).toBe(40)
  })
})
