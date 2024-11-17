import type { StringReplace } from './StringReplace'

describe('StringReplace', () => {
  test('should replace all occurrences of a substring', () => {
    type Result = StringReplace<'~1user~1profile', '~1', '/'>
    expectTypeOf<Result>().toEqualTypeOf<'/user/profile'>()
  })

  test('should replace all occurrences of a substring with an empty string by default', () => {
    type Result = StringReplace<'hello world', 'o'>
    expectTypeOf<Result>().toEqualTypeOf<'hell wrld'>()
  })

  test('should replace all occurrences of a substring with another substring', () => {
    type Result = StringReplace<'foo bar foo', 'foo', 'baz'>
    expectTypeOf<Result>().toEqualTypeOf<'baz bar baz'>()
  })

  test('should return the original string if the substring is not found', () => {
    type Result = StringReplace<'hello world', 'x', 'y'>
    expectTypeOf<Result>().toEqualTypeOf<'hello world'>()
  })

  test('should handle empty string as input', () => {
    type Result = StringReplace<'', 'a', 'b'>
    expectTypeOf<Result>().toEqualTypeOf<''>()
  })

  test('should replace substring at the start of the string', () => {
    type Result = StringReplace<'foobar', 'foo', 'baz'>
    expectTypeOf<Result>().toEqualTypeOf<'bazbar'>()
  })

  test('should replace substring at the end of the string', () => {
    type Result = StringReplace<'barfoo', 'foo', 'baz'>
    expectTypeOf<Result>().toEqualTypeOf<'barbaz'>()
  })
})
