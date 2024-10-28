import type { BooleanAnd } from './BooleanAnd'

describe('BooleanAnd', () => {
  test('should return true when [true, true] is passed', () => {
    type Result = BooleanAnd<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [true, false] is passed', () => {
    type Result = BooleanAnd<false, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, true] is passed', () => {
    type Result = BooleanAnd<true, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, false] is passed', () => {
    type Result = BooleanAnd<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanAnd<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanAnd<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return false when [boolean, false] is passed', () => {
    type Result = BooleanAnd<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, boolean] is passed', () => {
    type Result = BooleanAnd<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanAnd<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
