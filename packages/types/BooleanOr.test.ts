import type { BooleanOr } from './BooleanOr'

describe('BooleanOr', () => {
  test('should return true when [true, false] is passed', () => {
    type Result = BooleanOr<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, true] is passed', () => {
    type Result = BooleanOr<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [false, false] is passed', () => {
    type Result = BooleanOr<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when [true, true] is passed', () => {
    type Result = BooleanOr<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanOr<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanOr<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return true when [boolean, true] is passed', () => {
    type Result = BooleanOr<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [true, boolean] is passed', () => {
    type Result = BooleanOr<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanOr<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
