import { variance } from './variance'

describe('variance', () => {
  test('should compute the variance of a set of numbers', () => {
    const result = variance(10, 20, 30)
    expect(result).toStrictEqual(66.66666666666667)
  })
})
