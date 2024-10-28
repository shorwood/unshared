import { nor } from './nor'

describe('nor', () => {
  test('should return true if both parameters are false', () => {
    const result = nor(false, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the first parameter is true', () => {
    const result = nor(true, false)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if the second parameter is true', () => {
    const result = nor(false, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return false if both parameters are true', () => {
    const result = nor(true, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if all values are false', () => {
    const result = nor(false, false, false, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if some values are true', () => {
    const result = nor(false, false, false, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
