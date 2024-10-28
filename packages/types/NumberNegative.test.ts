import type { NumberNegative } from './NumberNegative'

describe('NumberNegative', () => {
  test('should match a negative integer', () => {
    type Result = NumberNegative<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should match a negative decimal', () => {
    type Result = NumberNegative<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1.1>()
  })

  test('should not match a positive integer', () => {
    type Result = NumberNegative<1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match a positive decimal', () => {
    type Result = NumberNegative<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not match zero', () => {
    type Result = NumberNegative<0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match number', () => {
    type Result = NumberNegative<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
