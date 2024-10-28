import { not } from './not'

describe('not', () => {
  test('should return true if the parameter is false', () => {
    const result = not(false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the parameter is true', () => {
    const result = not(true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return a boolean type if the parameter is a boolean', () => {
    const result = not(true as boolean)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
