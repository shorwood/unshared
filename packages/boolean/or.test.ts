import { or } from './or'

describe('or', () => {
  test('should return true if both parameters are true', () => {
    const result = or(true, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the first parameter is true', () => {
    const result = or(true, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the second parameter is true', () => {
    const result = or(false, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if both parameters are false', () => {
    const result = or(false, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if some values are true', () => {
    const result = or(false, false, false, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are false', () => {
    const result = or(false, false, false, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
