import { factorial } from './factorial'

describe('factorial', () => {
  test('should compute the factorial of a 0', () => {
    const result = factorial(0)
    expect(result).toBe(1)
  })

  test('should compute the factorial of a 5', () => {
    const result = factorial(5)
    expect(result).toBe(120)
  })

  test('should highlight invalid input when the argument is negative', () => {

    // @ts-expect-error: Testing invalid input
    const shouldThrow = () => factorial(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should highlight invalid input when the argument is not an integer', () => {

    // @ts-expect-error: Testing invalid input
    const shouldThrow = () => factorial(1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
})
