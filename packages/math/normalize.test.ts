import { normalize } from './normalize'

describe('normalize', () => {
  test('should normalize a number to a given range', () => {
    const result = normalize(5, 0, 10)
    expect(result).toStrictEqual(0.5)
  })

  test('should normalize a number to a given range with negative numbers', () => {
    const result = normalize(0, -10, 10)
    expect(result).toStrictEqual(0.5)
  })

  test('should normalize and clamp max values', () => {
    const result = normalize(15, 0, 10)
    expect(result).toBe(1)
  })

  test('should normalize and clamp min values', () => {
    const result = normalize(-5, 0, 10)
    expect(result).toBe(0)
  })
})
