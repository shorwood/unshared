import type { NumberIntegerNegative } from './NumberIntegerNegative'

describe('NumberIntegerNegative', () => {
  test('should match a negative integer', () => {
    type Result = NumberIntegerNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberIntegerNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberIntegerNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a positive decimal', () => {
    type Result = NumberIntegerNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberIntegerNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberIntegerNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
