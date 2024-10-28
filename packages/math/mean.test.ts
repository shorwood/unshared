import { mean } from './mean'

describe('mean', () => {
  test('should compute the mean of a set of numbers', () => {
    const result = mean(10, 20, 30)
    expect(result).toBe(20)
  })
})
