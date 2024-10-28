import { sqrt } from './sqrt'

describe('sqrt', () => {
  test('should compute the square root of a number', () => {
    const result = sqrt(9)
    expect(result).toBe(3)
  })
})
