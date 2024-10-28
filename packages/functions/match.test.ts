import { match } from './match'

describe('match', () => {
  test('should match a value with a set of values and return their corresponding values', () => {
    const result = match('a', { a: 1, b: '2' })
    expect(result).toBe(1)
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>()
  })

  test('should match a value with a set of predicate functions and return their corresponding values', () => {
    const result = match('b', [
      [v => v === 'a', 1],
      [v => v === 'b', 2],
    ])
    expect(result).toBe(2)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
  })

  test('should match a value in the map and return the corresponding value', () => {
    const result = match('a', [['a', 1], ['b', 2]])
    expect(result).toBe(1)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
  })

  test('should match a value and return value of a mixed type', () => {
    const result = match<number | string, string>('a', [
      [v => v === 'a', 1],
      ['b', '2'],
    ])
    expect(result).toBe(1)
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>()
  })

  test('should return the default value if no matches are found', () => {
    const result = match('c', { a: 1, b: 2 })
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
  })
})
