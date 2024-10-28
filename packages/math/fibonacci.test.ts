import { fibonacci } from './fibonacci'

describe('fibonacci', () => {
  test('should compute Fibonacci number at 0', () => {
    const result = fibonacci(0)
    expect(result).toBe(0)
  })

  test('should compute Fibonacci number at 1', () => {
    const result = fibonacci(1)
    expect(result).toBe(1)
  })

  test('should compute Fibonacci number at N', () => {
    const result = fibonacci(50)
    expect(result).toBe(12586269025)
  })

  test('should throw when the argument is negative', () => {

    // @ts-expect-error: Test negative number
    const shouldThrow = () => fibonacci(-1)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at negative index')
  })

  test('should throw when the argument is not an integer', () => {

    // @ts-expect-error: Test non-integer number
    const shouldThrow = () => fibonacci(1.5)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at non-integer index')
  })

  test('should throw when the argument is not a safe integer', () => {
    const shouldThrow = () => fibonacci(Number.MAX_SAFE_INTEGER + 1)
    expect(shouldThrow).toThrow('Cannot calculate Fibonacci number at non-integer index')
  })
})
