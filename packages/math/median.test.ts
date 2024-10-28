import { median } from './median'

describe('median', () => {
  test('should compute the median of a set of odd numbers', () => {
    const result = median(50, 10, 10)
    expect(result).toBe(10)
  })

  test('should compute the median of a set of even numbers', () => {
    const result = median(50, 10, 10, 20)
    expect(result).toBe(15)
  })
})
