import { clamp } from './clamp'

describe('clamp', () => {
  test('should be in range', () => {
    const result = clamp(5, 0, 10)
    expect(result).toBe(5)
  })

  test('should clamp to a positive number', () => {
    const result = clamp(30, 0, 20)
    expect(result).toBe(20)
  })

  test('should clamp to a negative number', () => {
    const result = clamp(-20, -10, 10)
    expect(result).toBe(-10)
  })

  test('should clamp to a positive zero', () => {
    const result = clamp(-0, -10, 0)
    expect(result).toBe(0)
  })

  test('should throw an error if min is greater than max', () => {
    const shouldThrow = () => clamp(0, 10, 0)
    expect(shouldThrow).toThrow(RangeError)
    expect(shouldThrow).toThrow('Expected the minimum value to be less than or equal to the maximum value')
  })
})
