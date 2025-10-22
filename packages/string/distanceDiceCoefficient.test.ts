import { distanceDiceCoefficient } from './distanceDiceCoefficient'

describe('distanceDiceCoefficient', () => {
  test('should return the distance between two empty strings', () => {
    const result = distanceDiceCoefficient('', '')
    expect(result).toBe(1)
  })

  test('should return the distance between Potato and Tomato', () => {
    const result = distanceDiceCoefficient('Potato', 'Tomato')
    expect(result).toStrictEqual(0.4)
  })

  test('should return the distance between Sitting and Kitten', () => {
    const result = distanceDiceCoefficient('Sitting', 'Kitten')
    expect(result).toStrictEqual(0.36363636363636365)
  })

  test('should return the distance between Saturday and Sunday', () => {
    const result = distanceDiceCoefficient('Saturday', 'Sunday')
    expect(result).toStrictEqual(0.3333333333333333)
  })

  test('should return the distance between wikipedia and wikipédia', () => {
    const result = distanceDiceCoefficient('wikipedia', 'wikipédia')
    expect(result).toStrictEqual(0.75)
  })

  test('should return the distance between Mississippi and Missouri', () => {
    const result = distanceDiceCoefficient('Mississippi', 'Missouri')
    expect(result).toStrictEqual(0.35294117647058826)
  })

  test('should return 0 for strings with length less than 2', () => {
    const result = distanceDiceCoefficient('a', 'ab')
    expect(result).toBe(0)
  })

  test('should return 0 for completely different strings', () => {
    const result = distanceDiceCoefficient('abc', 'xyz')
    expect(result).toBe(0)
  })

  test('should handle identical strings', () => {
    const result = distanceDiceCoefficient('hello', 'hello')
    expect(result).toBe(1)
  })
})
