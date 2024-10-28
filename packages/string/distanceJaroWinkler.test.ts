import { distanceJaroWinkler } from './distanceJaroWinkler'

describe('distanceJaroWinkler', () => {
  test('should return the distance between two empty strings', () => {
    const result = distanceJaroWinkler('', '')
    expect(result).toBe(1)
  })

  test('should return the distance between Potato and Tomato', () => {
    const result = distanceJaroWinkler('Potato', 'Tomato')
    expect(result).toStrictEqual(0.6944444444444443)
  })

  test('should return the distance between Sitting and Kitten', () => {
    const result = distanceJaroWinkler('Sitting', 'Kitten')
    expect(result).toStrictEqual(0.746031746031746)
  })

  test('should return the distance between Saturday and Sunday', () => {
    const result = distanceJaroWinkler('Saturday', 'Sunday')
    expect(result).toStrictEqual(0.7475)
  })

  test('should return the distance between wikipedia and wikipédia', () => {
    const result = distanceJaroWinkler('wikipedia', 'wikipédia')
    expect(result).toStrictEqual(0.9555555555555556)
  })

  test('should return the distance between Mississippi and Missouri', () => {
    const result = distanceJaroWinkler('Mississippi', 'Missouri')
    expect(result).toStrictEqual(0.8159090909090909)
  })
})
