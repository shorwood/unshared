import type { BooleanNor } from './BooleanNor'

describe('BooleanNor', () => {
  test('should return false when [true, false] is passed', () => {
    type Result = BooleanNor<true, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, true] is passed', () => {
    type Result = BooleanNor<false, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when [false, false] is passed', () => {
    type Result = BooleanNor<false, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [true, true] is passed', () => {
    type Result = BooleanNor<true, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [boolean, false] is passed', () => {
    type Result = BooleanNor<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return false when [false, boolean] is passed', () => {
    type Result = BooleanNor<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return false when [boolean, true] is passed', () => {
    type Result = BooleanNor<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [true, boolean] is passed', () => {
    type Result = BooleanNor<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanNor<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
