import { nand } from './nand'

describe('nand', () => {
  test('should return false if both parameters are true', () => {
    const result = nand(true, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return true if the first parameter is false', () => {
    const result = nand(true, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the second parameter is false', () => {
    const result = nand(false, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if both parameters are false', () => {
    const result = nand(false, false)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if some values are false', () => {
    const result = nand(false, false, false, true)
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  test('should return false if all values are true', () => {
    const result = nand(true, true, true, true)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
