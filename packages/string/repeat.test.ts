import { repeat } from './repeat'

describe('repeat', () => {
  test('should repeat a string n times', () => {
    const result = repeat('a', 3)
    expect(result).toBe('aaa')
    expectTypeOf(result).toEqualTypeOf<'aaa'>()
  })

  test('should repeat a string n times with a separator', () => {
    const result = repeat('a', 3, ',')
    expect(result).toBe('a,a,a')
    expectTypeOf(result).toEqualTypeOf<'a,a,a'>()
  })

  test('should return an empty string if length is zero', () => {
    const result = repeat('a', 0)
    expect(result).toBe('')
    expectTypeOf(result).toEqualTypeOf<''>()
  })

  test('should return an empty string if length is negative', () => {
    const result = repeat('a', -1)
    expect(result).toBe('')
  })
})
