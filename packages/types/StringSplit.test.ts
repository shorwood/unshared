import type { StringSplit } from './StringSplit'

describe('StringSplit', () => {
  test('should return each character of literral as litterals', () => {
    type Result = StringSplit<'Hello'>
    type Expected = ['H', 'e', 'l', 'l', 'o']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return literrals split by a comma', () => {
    type Result = StringSplit<'Hello,World', ','>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return literrals split by a dash', () => {
    type Result = StringSplit<'Hello-World', '-'>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle separator at the end of the string', () => {
    type Result = StringSplit<'Hello,World,', ','>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle separator at the start of the string', () => {
    type Result = StringSplit<',Hello,World', ','>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return the string type', () => {
    type Result = StringSplit<string>
    type Expected = string[]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
