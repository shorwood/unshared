import type {
  Absolute,
  Add,
  Divide,
  IsDivisibleBy,
  IsEqualOrGreater,
  IsEqualOrLower,
  IsGreater,
  IsLower,
  Maximum,
  Minimum,
  Modulo,
  Multiply,
  Negative,
  Substract,
} from './arithmetics'

describe('arithmetics', () => {
  test('should add two numbers', () => {
    expectTypeOf<Add<1, 2>>().toEqualTypeOf<3>()
    expectTypeOf<Add<2, 1>>().toEqualTypeOf<3>()
  })

  test('should substract two numbers', () => {
    expectTypeOf<Substract<3, 2>>().toEqualTypeOf<1>()
    expectTypeOf<Substract<2, 3>>().toEqualTypeOf<never>()
  })

  test('should get the absolute value of a number', () => {
    expectTypeOf<Absolute<-5>>().toEqualTypeOf<5>()
    expectTypeOf<Absolute<5>>().toEqualTypeOf<5>()
  })

  test('should get the negative value of a number', () => {
    expectTypeOf<Negative<-5>>().toEqualTypeOf<5>()
    expectTypeOf<Negative<5>>().toEqualTypeOf<-5>()
  })

  test('should divide two numbers', () => {
    expectTypeOf<Divide<10, 2>>().toEqualTypeOf<5>()
    expectTypeOf<Divide<10, 3>>().toEqualTypeOf<3>()
  })

  test('should multiply two numbers', () => {
    expectTypeOf<Multiply<10, 2>>().toEqualTypeOf<20>()
    expectTypeOf<Multiply<2, 10>>().toEqualTypeOf<20>()
  })

  test('should get the modulo of two numbers', () => {
    expectTypeOf<Modulo<10, 3>>().toEqualTypeOf<1>()
    expectTypeOf<Modulo<3, 10>>().toEqualTypeOf<3>()
  })

  test('should get the minimum of two numbers', () => {
    expectTypeOf<Minimum<3, 10>>().toEqualTypeOf<3>()
    expectTypeOf<Minimum<10, 3>>().toEqualTypeOf<3>()
  })

  test('should get the maximum of two numbers', () => {
    expectTypeOf<Maximum<10, 3>>().toEqualTypeOf<10>()
    expectTypeOf<Maximum<3, 10>>().toEqualTypeOf<10>()
  })

  test('should check if a number is lower than another', () => {
    expectTypeOf<IsLower<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsLower<2, 1>>().toEqualTypeOf<false>()
  })

  test('should check if a number is greater than another', () => {
    expectTypeOf<IsGreater<2, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsGreater<1, 2>>().toEqualTypeOf<false>()
  })

  test('should check if a number is equal or lower than another', () => {
    expectTypeOf<IsEqualOrLower<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqualOrLower<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqualOrLower<2, 1>>().toEqualTypeOf<false>()
  })

  test('should check if a number is equal or greater than another', () => {
    expectTypeOf<IsEqualOrGreater<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqualOrGreater<2, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqualOrGreater<1, 2>>().toEqualTypeOf<false>()
  })

  test('should check if a number is divisible by another', () => {
    expectTypeOf<IsDivisibleBy<4, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsDivisibleBy<4, 3>>().toEqualTypeOf<false>()
  })
})
