import { xor } from './xor'

describe('xor', () => {
  test('should return true if both parameters are true', () => {
    const result = xor(true, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the first parameter is false', () => {
    const result = xor(true, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the second parameter is false', () => {
    const result = xor(false, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if the first parameter is false', () => {
    const result = xor(false, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if some values are true and some are false', () => {
    const result = xor(true, false, true, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are true', () => {
    const result = xor(true, true, true, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are false', () => {
    const result = xor(false, false, false, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
