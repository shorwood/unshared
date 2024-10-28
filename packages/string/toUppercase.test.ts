import { toUppercase } from './toUppercase'

describe('toUppercase', () => {
  test('should convert a string to upper case', () => {
    const result = toUppercase('foo_bar_1')
    expect(result).toBe('FOO_BAR_1')
    expectTypeOf(result).toEqualTypeOf<'FOO_BAR_1'>()
  })
})
