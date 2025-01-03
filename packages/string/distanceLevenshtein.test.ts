import { distanceLevenshtein } from './distanceLevenshtein'

describe('distanceLevenshtein', () => {
  test('should return the distance between two empty strings', () => {
    const result = distanceLevenshtein('', '')
    expect(result).toBe(0)
  })

  test('should return the distance between Potato and Tomato', () => {
    const result = distanceLevenshtein('Potato', 'Tomato')
    expect(result).toBe(2)
  })

  test('should return the distance between Sitting and Kitten', () => {
    const result = distanceLevenshtein('Sitting', 'Kitten')
    expect(result).toBe(3)
  })

  test('should return the distance between Saturday and Sunday', () => {
    const result = distanceLevenshtein('Saturday', 'Sunday')
    expect(result).toBe(3)
  })

  test('should return the distance between wikipedia and wikipédia', () => {
    const result = distanceLevenshtein('wikipedia', 'wikipédia')
    expect(result).toBe(1)
  })

  test('should return the distance between Mississippi and Missouri', () => {
    const result = distanceLevenshtein('Mississippi', 'Missouri')
    expect(result).toBe(6)
  })
})
