import type { MathNegative } from './MathNegative'

describe('MathNegative', () => {
  test('should negate a positive integer', () => {
    type Result = MathNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should negate a negative integer', () => {
    type Result = MathNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should negate a positive decimal', () => {
    type Result = MathNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should negate a negative decimal', () => {
    type Result = MathNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not negate zero', () => {
    type Result = MathNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should negate number', () => {
    type Result = MathNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
