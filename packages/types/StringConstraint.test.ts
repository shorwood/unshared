import type { StringConstraint } from './StringConstraint'

describe('StringConstraint', () => {
  test('should return a literal constrained with single character and fixed length', () => {
    type Result = StringConstraint<'a', 3>
    expectTypeOf<Result>().toEqualTypeOf<'aaa'>()
  })

  test('should return a literal constrained with multiple characters and fixed length', () => {
    type Result = StringConstraint<'a' | 'b', 2>
    expectTypeOf<Result>().toEqualTypeOf<'aa' | 'ab' | 'ba' | 'bb'>()
  })

  test('should return a literal constrained with single character and variable length', () => {
    type Result = StringConstraint<'a', 2 | 3>
    expectTypeOf<Result>().toEqualTypeOf<'aa' | 'aaa'>()
  })

  test('should return a literal constrained with multiple characters and variable length', () => {
    type Result = StringConstraint<'a' | 'b', 1 | 2>
    expectTypeOf<Result>().toEqualTypeOf<'a' | 'aa' | 'ab' | 'b' | 'ba' | 'bb'>()
  })

  test('should return "" if length is 0', () => {
    type Result = StringConstraint<'a', 0>
    expectTypeOf<Result>().toEqualTypeOf<''>()
  })

  test('should return string if length is number', () => {
    type Result = StringConstraint<'a', number>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should return string if character is string', () => {
    type Result = StringConstraint<string, 2>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should return never if length is negative', () => {
    type Result = StringConstraint<'a', -1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
