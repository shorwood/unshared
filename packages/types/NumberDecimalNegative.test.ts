import type { NumberDecimalNegative } from './NumberDecimalNegative'

describe('NumberDecimalNegative', () => {
  test('should not match a positive decimal', () => {
    type Result = NumberDecimalNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberDecimalNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match a negative decimal', () => {
    type Result = NumberDecimalNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberDecimalNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberDecimalNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberDecimalNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
