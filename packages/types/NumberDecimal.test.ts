import type { NumberDecimal } from './NumberDecimal'

describe('NumberDecimal', () => {
  test('should match a positive decimal', () => {
    type Result = NumberDecimal<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1.1>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberDecimal<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a negative decimal', () => {
    type Result = NumberDecimal<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should not match a negative integer', () => {
    type Result = NumberDecimal<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberDecimal<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberDecimal<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
