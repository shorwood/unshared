import type { NotStringEmpty } from './NotStringEmpty'

describe('NotStringEmpty', () => {
  test('should match a string type', () => {
    type Result = NotStringEmpty<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should match a literal string', () => {
    type Result = NotStringEmpty<'bar' | 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'bar' | 'foo'>()
  })

  test('should exclude an empty string', () => {
    type Result = NotStringEmpty<''>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
