import type { NumberPositive } from './NumberPositive'

describe('NumberPositive', () => {
  test('should match a positive integer', () => {
    type Result = NumberPositive<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should match a positive decimal', () => {
    type Result = NumberPositive<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberPositive<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberPositive<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberPositive<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberPositive<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
