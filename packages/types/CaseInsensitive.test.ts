import type { CaseInsensitive } from './CaseInsensitive'

describe('CaseInsensitive', () => {
  test('should match case-insensitive strings', () => {
    type Result = CaseInsensitive<'foo'>
    type Expected = 'FOO' | 'FOo' | 'FoO' | 'Foo' | 'fOO' | 'fOo' | 'foO' | 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should match case-insensitive strings with numbers', () => {
    type Result = CaseInsensitive<'foo123'>
    type Expected = 'FOO123' | 'FOo123' | 'FoO123' | 'Foo123' | 'fOO123' | 'fOo123' | 'foO123' | 'foo123'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return string if S is string', () => {
    type Result = CaseInsensitive<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
})
