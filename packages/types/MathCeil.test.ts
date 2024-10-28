import type { MathCeil } from './MathCeil'

describe('MathCeil', () => {
  test('should ceil a positive decimal', () => {
    type Result = MathCeil<1.1>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should ceil a negative decimal', () => {
    type Result = MathCeil<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should ceil a positive integer', () => {
    type Result = MathCeil<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should ceil a negative integer', () => {
    type Result = MathCeil<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should ceil zero', () => {
    type Result = MathCeil<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should ceil number', () => {
    type Result = MathCeil<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
