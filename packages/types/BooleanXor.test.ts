import type { BooleanXor } from './BooleanXor'

describe('BooleanXor', () => {
  test('should return true when [true, false] is passed', () => {
    type Result = BooleanXor<true, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [false, true] is passed', () => {
    type Result = BooleanXor<false, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return false when [true, true] is passed', () => {
    type Result = BooleanXor<true, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, false] is passed', () => {
    type Result = BooleanXor<false, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanXor<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanXor<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanXor<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanXor<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanXor<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
