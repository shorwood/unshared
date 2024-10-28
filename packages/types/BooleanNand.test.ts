import type { BooleanNand } from './BooleanNand'

describe('BooleanNand', () => {
  test('should return true when [true, false] is passed', () => {
    type Result = BooleanNand<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, true] is passed', () => {
    type Result = BooleanNand<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, false] is passed', () => {
    type Result = BooleanNand<false, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [true, true] is passed', () => {
    type Result = BooleanNand<true, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when [boolean, false] is passed', () => {
    type Result = BooleanNand<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, boolean] is passed', () => {
    type Result = BooleanNand<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [boolean, true] is passed', () => {
    type Result = BooleanNand<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return false when [true, boolean] is passed', () => {
    type Result = BooleanNand<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanNand<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
