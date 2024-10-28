import { sum } from './sum'

describe('sum', () => {
  test('should give the sum of 3 numbers', () => {
    const result = sum(2, 2, 2)
    expect(result).toBe(6)
  })

  test('should give the sum of 1 number', () => {
    const result = sum(2)
    expect(result).toBe(2)
  })

  test('should return 0 when no numbers are provided', () => {
    const result = sum()
    expect(result).toBe(0)
  })
})
