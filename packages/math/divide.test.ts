import { divide } from './divide'

describe('divide', () => {
  test('should divide integers', () => {
    const result = divide(10, 20)
    expect(result).toStrictEqual(0.5)
  })
})
