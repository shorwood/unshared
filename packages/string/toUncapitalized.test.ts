import { toUncapitalized } from './toUncapitalized'

describe('toUncapitalized', () => {
  test('should capitalize the first letter of a string', () => {
    const result = toUncapitalized('FooBar')
    expect(result).toBe('fooBar')
    expectTypeOf(result).toEqualTypeOf<'fooBar'>()
  })

  test('should capitalize a single character', () => {
    const result = toUncapitalized('A')
    expect(result).toBe('a')
    expectTypeOf(result).toEqualTypeOf<'a'>()
  })

  test('should capitalize an empty string', () => {
    const result = toUncapitalized('')
    expect(result).toBe('')
    expectTypeOf(result).toEqualTypeOf<''>()
  })
})
