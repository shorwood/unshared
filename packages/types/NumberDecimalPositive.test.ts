import type { NumberDecimalPositive } from './NumberDecimalPositive'

describe('NumberDecimalPositive', () => {
  test('should match a positive decimal', () => {
    type Result = NumberDecimalPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberDecimalPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberDecimalPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberDecimalPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberDecimalPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberDecimalPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
