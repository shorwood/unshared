import { xnor } from './xnor'

describe('xnor', () => {
  test('should return true if both parameters are true', () => {
    const result = xnor(true, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is false', () => {
    const result = xnor(true, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is false', () => {
    const result = xnor(false, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the first parameter is false', () => {
    const result = xnor(false, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are false', () => {
    const result = xnor(false, false, false, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return true if all values are true', () => {
    const result = xnor(true, true, true, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are true and some are false', () => {
    const result = xnor(true, true, false, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
