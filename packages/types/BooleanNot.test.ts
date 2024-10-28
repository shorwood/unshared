import type { BooleanNot } from './BooleanNot'

describe('BooleanNot', () => {
  test('should return false when true is passed', () => {
    type Result = BooleanNot<true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when false is passed', () => {
    type Result = BooleanNot<false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when boolean is passed', () => {
    type Result = BooleanNot<boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
