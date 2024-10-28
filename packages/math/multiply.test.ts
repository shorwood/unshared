import { multiply } from './multiply'

describe('multiply', () => {
  test('should multiply integers', () => {
    const result = multiply(10, 2)
    expect(result).toBe(20)
  })
})
