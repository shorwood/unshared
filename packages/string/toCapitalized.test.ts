import { toCapitalized } from './toCapitalized'

describe('toCapitalized', () => {
  test('should capitalize the first letter of a string', () => {
    const result = toCapitalized('fooBar')
    expect(result).toBe('FooBar')
    expectTypeOf(result).toEqualTypeOf<'FooBar'>()
  })

  test('should capitalize a single character', () => {
    const result = toCapitalized('a')
    expect(result).toBe('A')
    expectTypeOf(result).toEqualTypeOf<'A'>()
  })

  test('should capitalize an empty string', () => {
    const result = toCapitalized('')
    expect(result).toBe('')
    expectTypeOf(result).toEqualTypeOf<''>()
  })
})
