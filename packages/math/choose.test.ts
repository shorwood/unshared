import { choose } from './choose'

describe('choose', () => {
  test('should return 1 when k is 0', () => {
    const result = choose(5, 0)
    expect(result).toBe(1)
  })

  test('should return 0 when k is greater than n', () => {
    const result = choose(5, 6)
    expect(result).toBe(0)
  })

  test('should return the correct binomial coefficient', () => {
    expect(choose(5, 2)).toBe(10)
    expect(choose(6, 3)).toBe(20)
    expect(choose(10, 5)).toBe(252)
  })

  test('should handle large numbers', () => {
    const result = choose(100, 50)
    // eslint-disable-next-line no-loss-of-precision
    expect(result).toBe(100891344545564193334812497256)
  })

  test('should return 1 when n equals k', () => {
    const result = choose(5, 5)
    expect(result).toBe(1)
  })
})
