import type { MathIncrease } from './MathIncrease'

describe('MathIncrease', () => {
  test('should increase a positive integer', () => {
    type Result = MathIncrease<1>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should increase a negative integer', () => {
    type Result = MathIncrease<-1>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should increase zero', () => {
    type Result = MathIncrease<0>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should increase number', () => {
    type Result = MathIncrease<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
