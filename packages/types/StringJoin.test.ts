import type { StringJoin } from './StringJoin'

describe('StringJoin', () => {
  test('should join strings with a delimiter', () => {
    type Result = StringJoin<['foo', 'bar', 'baz'], '-'>
    expectTypeOf<Result>().toEqualTypeOf<'foo-bar-baz'>()
  })

  test('should join strings without a delimiter', () => {
    type Result = StringJoin<['foo', 'bar', 'baz']>
    expectTypeOf<Result>().toEqualTypeOf<'foobarbaz'>()
  })

  test('should return an empty string for an empty array', () => {
    type Result = StringJoin<[]>
    expectTypeOf<Result>().toEqualTypeOf<''>()
  })

  test('should handle a single string in the array', () => {
    type Result = StringJoin<['foo'], '-'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })

  test('should handle an array with empty strings', () => {
    type Result = StringJoin<['', '', ''], '-'>
    expectTypeOf<Result>().toEqualTypeOf<'--'>()
  })

  test('should return string if the array is not a tuple', () => {
    type Result = StringJoin<string[]>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
})
