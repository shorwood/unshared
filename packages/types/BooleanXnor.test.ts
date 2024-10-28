import type { BooleanXnor } from './BooleanXnor'

describe('BooleanXnor', () => {
  test('should return false when [true, false] is passed', () => {
    type Result = BooleanXnor<true, false>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return false when [false, true] is passed', () => {
    type Result = BooleanXnor<false, true>
    expectTypeOf<Result>().toEqualTypeOf<false>()
  })

  test('should return true when [false, false] is passed', () => {
    type Result = BooleanXnor<false, false>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return true when [true, true] is passed', () => {
    type Result = BooleanXnor<true, true>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('should return boolean when [boolean, false] is passed', () => {
    type Result = BooleanXnor<boolean, false>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [false, boolean] is passed', () => {
    type Result = BooleanXnor<false, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [boolean, true] is passed', () => {
    type Result = BooleanXnor<boolean, true>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [true, boolean] is passed', () => {
    type Result = BooleanXnor<true, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should return boolean when [boolean, boolean] is passed', () => {
    type Result = BooleanXnor<boolean, boolean>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })
})
