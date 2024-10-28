import type { NumberIntegerPositive } from './NumberIntegerPositive'

describe('NumberIntegerPositive', () => {
  test('should match a positive integer', () => {
    type Result = NumberIntegerPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should not match a positive decimal', () => {
    type Result = NumberIntegerPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberIntegerPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberIntegerPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberIntegerPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberIntegerPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
