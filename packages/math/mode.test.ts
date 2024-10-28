import { mode } from './mode'

describe('mode', () => {
  test('should compute the mode of a set of numbers', () => {
    const result = mode(10, 10, 20, 30)
    expect(result).toBe(10)
  })
})
