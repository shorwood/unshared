import { join } from './join'

describe('join', () => {
  test('should join an array of strings', () => {
    const result = join(['a', 'b', 'c'] as const, ',')
    expect(result).toBe('a,b,c')
    expectTypeOf(result).toEqualTypeOf<'a,b,c'>()
  })

  test('should join an array of strings with no separator', () => {
    const result = join(['a', 'b', 'c'] as const)
    expect(result).toBe('abc')
    expectTypeOf(result).toEqualTypeOf<'abc'>()
  })
})
