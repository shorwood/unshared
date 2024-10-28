import type { MathDecrease } from './MathDecrease'

describe('MathDecrease', () => {
  test('should decrease a positive integer', () => {
    type Result = MathDecrease<2>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should decrease a negative integer', () => {
    type Result = MathDecrease<-1>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should decrease zero', () => {
    type Result = MathDecrease<0>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should decrease number', () => {
    type Result = MathDecrease<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
