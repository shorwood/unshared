import type { MathSquare } from './MathSquare'

describe('MathSquare', () => {
  test('should square a positive integer', () => {
    type Result = MathSquare<2>
    expectTypeOf<Result>().toEqualTypeOf<4>()
  })

  test('should square a negative integer', () => {
    type Result = MathSquare<-2>
    expectTypeOf<Result>().toEqualTypeOf<4>()
  })

  test('should return zero when squaring zero', () => {
    type Result = MathSquare<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should square number to number', () => {
    type Result = MathSquare<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should square decimal to number', () => {
    type Result = MathSquare<2.2>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
