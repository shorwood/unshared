import { parseBoolean } from './parseBoolean'

describe('parseBoolean', () => {
  test('should return true if the value is "true"', () => {
    const result = parseBoolean('true')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "TRUE"', () => {
    const result = parseBoolean('TRUE')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "True"', () => {
    const result = parseBoolean('True')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true if the value is "1"', () => {
    const result = parseBoolean('1')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return true even if the value is padded with spaces', () => {
    const result = parseBoolean(' 1 ')
    expect(result).toBe(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  test('should return false if the value is not one of the above', () => {
    const result = parseBoolean('false')
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  test('should return boolean if the value is a non-literal', () => {
    const result = parseBoolean('false' as string)
    expect(result).toBe(false)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})
