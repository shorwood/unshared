import { toLowercase } from './toLowercase'

describe('toLowercase', () => {
  test('should convert a string to lower case', () => {
    const result = toLowercase('FOO_BAR_1')
    expect(result).toBe('foo_bar_1')
    expectTypeOf(result).toEqualTypeOf<'foo_bar_1'>()
  })
})
