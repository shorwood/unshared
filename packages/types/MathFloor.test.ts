import type { MathFloor } from './MathFloor'

describe('MathFloor', () => {
  test('should floor a positive decimal', () => {
    type Result = MathFloor<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should floor a negative decimal', () => {
    type Result = MathFloor<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should floor a positive integer', () => {
    type Result = MathFloor<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should floor a negative integer', () => {
    type Result = MathFloor<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should floor zero to zero', () => {
    type Result = MathFloor<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number when given number', () => {
    type Result = MathFloor<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
