import type { MathAbsolute } from './MathAbsolute'

describe('MathAbsolute', () => {
  test('should get the absolute value of a positive integer', () => {
    type Result = MathAbsolute<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should get the absolute value of a negative integer', () => {
    type Result = MathAbsolute<-1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should get the absolute value of a positive float', () => {
    type Result = MathAbsolute<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should get the absolute value of a negative float', () => {
    type Result = MathAbsolute<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should get the absolute value of zero', () => {
    type Result = MathAbsolute<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should get the absolute value of number', () => {
    type Result = MathAbsolute<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
