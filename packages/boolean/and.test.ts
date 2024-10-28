import { and } from './and'

describe('and', () => {
  test('should return true if both parameters are true', () => {
    const result = and(true, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is false', () => {
    const result = and(true, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is false', () => {
    const result = and(false, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the first parameter is true', () => {
    const result = and(false, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are true', () => {
    const result = and(true, true, true, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are false', () => {
    const result = and(true, true, true, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
