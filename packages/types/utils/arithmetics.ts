import { IsEqual, IsStrictEqual, IsZero } from './predicate'
import { TupleLength } from '../TupleLength'
import { Tuple } from '../Tuple'
import { BooleanOr } from '../BooleanOr'
import { BooleanNot } from '../BooleanNot'
import { BooleanNor } from '../BooleanNor'

// --- Arithmetics operations (No range safety).
export type Add<A extends number, B extends number> = TupleLength<[...Tuple<A>, ...Tuple<B>]> extends infer U extends number ? U : never
export type Substract<A extends number, B extends number> = Tuple<A> extends [...(infer U), ...Tuple<B>] ? TupleLength<U> : never
export type Absolute<A extends number> = `${A}` extends `-${infer U extends number}` ? U : A
export type Negative<A extends number> = `-${A}` extends `${infer U extends number}` ? U : `${A}` extends `-${infer V extends number}` ? V : never
export type Divide<A extends number, B extends number, Q extends number = 0> = IsLower<A, B> extends true ? Q : Divide<Substract<A, B>, B, Add<Q, 1>>
export type Multiply<A extends number, B extends number, P extends number = 0> = IsZero<B> extends true ? P : Multiply<A, Substract<B, 1>, Add<A, P>>
export type Modulo<A extends number, B extends number, R extends number = 0> = IsLower<A, B> extends true ? A : Modulo<Substract<A, B>, B, Add<R, 1>>
export type Minimum<A extends number, B extends number> = IsLower<A, B> extends true ? A : B
export type Maximum<A extends number, B extends number> = IsLower<A, B> extends true ? B : A

// --- Number predicate. (No range safety).
export type IsLower<A extends number, B extends number> = Substract<A, B> extends never ? true : false
export type IsGreater<A extends number, B extends number> = BooleanNor<IsLower<A, B>, IsEqual<A, B>>
export type IsEqualOrLower<A extends number, B extends number> = BooleanOr<IsStrictEqual<A, B>, IsLower<A, B>>
export type IsEqualOrGreater<A extends number, B extends number> = BooleanNot<IsLower<A, B>>
export type IsDivisibleBy<A extends number, B extends number> = IsStrictEqual<Modulo<Absolute<A>, Absolute<B>>, 0>

/* v8 ignore start */
if (import.meta.vitest) {
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
}
