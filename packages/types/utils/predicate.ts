import { BooleanAnd } from '../BooleanAnd'
import { BooleanOr } from '../BooleanOr'
import { MaybeReadonly } from '../MaybeReadonly'

// --- Boolean operations
export type BooleanEvery<T extends boolean[]> = T extends [infer A extends boolean, ...infer B extends boolean[]] ? BooleanAnd<A, BooleanEvery<B>> : true
export type BooleanSome<T extends boolean[]> = T extends [infer A extends boolean, ...infer B extends boolean[]] ? BooleanOr<A, BooleanSome<B>> : false

// --- Predicate special types
export type IsUnknown<T> = [unknown] extends [T] ? true : false
export type IsNever<T> = [T] extends [never] ? true : false
export type IsVoid<T> = IsStrictEqual<T, void>
export type IsUndefined<T> = IsStrictEqual<T, undefined>
export type IsNil<T> = BooleanOr<IsUndefined<T>, IsVoid<T>>

// --- Predicate strings
export type IsString<S> = string extends S ? true : false
export type IsEmptyString<S> = S extends '' ? true : false

// --- Predicate array, objects and tuple
export type IsArray<T> = any[] extends T ? true : readonly any[] extends T ? true : false
export type IsTupleEmpty<T extends MaybeReadonly<any>> = T extends MaybeReadonly<[]> ? true : false
export type IsArrayOrTuple<T> = BooleanOr<IsArray<T>, IsTuple<T>>
export type IsTuple<T> = T extends MaybeReadonly<[any, ...infer B]> ? B extends [] ? true : IsTuple<B> : false

// --- Comparisons
export type IsEqual<A, B> = A extends B ? true : B extends A ? true : false
export type IsNotEqual<A, B> = A extends B ? false : B extends A ? false : true
export type IsStrictEqual<A, B> = A extends B ? B extends A ? true : false : false
export type IsStrictNotEqual<A, B> = A extends B ? B extends A ? false : true : true

// --- Predicate numbers
export type IsZero<N extends number> = N extends 0 ? true : false
export type IsNumber<N extends number> = number extends N ? true : false
export type IsPositive<N extends number> = `${N}` extends `-${number}` ? false : true
export type IsNegative<N extends number> = `${N}` extends `-${number}` ? true : false
export type IsInteger<N extends number> = `${N}` extends `${number}.${number}` ? false : true
export type IsDecimal<N extends number> = `${N}` extends `${number}.${number}` ? true : false

// --- Predicate combinations of numbers
export type IsAllZero<A extends number, B extends number> = BooleanAnd<IsZero<A>, IsZero<B>>
export type IsAllPositive<A extends number, B extends number> = BooleanAnd<IsPositive<A>, IsPositive<B>>
export type IsAllNegative<A extends number, B extends number> = BooleanAnd<IsNegative<A>, IsNegative<B>>
export type IsAnyZero<A extends number, B extends number> = BooleanOr<IsZero<A>, IsZero<B>>
export type IsAnyNumber<A extends number, B extends number> = BooleanOr<IsNumber<A>, IsNumber<B>>
export type IsAnyPositive<A extends number, B extends number> = BooleanOr<IsPositive<A>, IsPositive<B>>
export type IsAnyNegative<A extends number, B extends number> = BooleanOr<IsNegative<A>, IsNegative<B>>
export type IsAnyDecimal<A extends number, B extends number> = BooleanOr<IsDecimal<A>, IsDecimal<B>>

// --- Excluded types
export type ExcludeEmptyObject<T> = T extends Record<PropertyKey, never> ? never : T
export type ExcludeEmptyArray<T> = T extends [] ? never : T

/* v8 ignore end */
if (import.meta.vitest) {
  it('should check if all booleans are true', () => {
    expectTypeOf<BooleanEvery<[true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanEvery<[false]>>().toEqualTypeOf<false>()
    expectTypeOf<BooleanEvery<[true, true, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanEvery<[true, false, true]>>().toEqualTypeOf<false>()
  })

  it('should check if some booleans are true', () => {
    expectTypeOf<BooleanSome<[true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[false]>>().toEqualTypeOf<false>()
    expectTypeOf<BooleanSome<[true, true, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[true, false, true]>>().toEqualTypeOf<true>()
    expectTypeOf<BooleanSome<[false, false, false]>>().toEqualTypeOf<false>()
  })

  it('should check if a value is unknown', () => {
    expectTypeOf<IsUnknown<unknown>>().toEqualTypeOf<true>()
    expectTypeOf<IsUnknown<string>>().toEqualTypeOf<false>()
  })

  it('should check if a value is never', () => {
    expectTypeOf<IsNever<never>>().toEqualTypeOf<true>()
    expectTypeOf<IsNever<string>>().toEqualTypeOf<false>()
  })

  it('should check if a value is void', () => {
    expectTypeOf<IsVoid<void>>().toEqualTypeOf<true>()
    expectTypeOf<IsVoid<undefined>>().toEqualTypeOf<false>()
  })

  it('should check if a value is undefined', () => {
    expectTypeOf<IsUndefined<undefined>>().toEqualTypeOf<true>()
    expectTypeOf<IsUndefined<void>>().toEqualTypeOf<false>()
  })

  it('should check if a value is nil', () => {
    expectTypeOf<IsNil<undefined>>().toEqualTypeOf<true>()
    expectTypeOf<IsNil<void>>().toEqualTypeOf<true>()
    expectTypeOf<IsNil<null>>().toEqualTypeOf<false>()
  })

  it('should check if a value is a string', () => {
    expectTypeOf<IsString<string>>().toEqualTypeOf<true>()
    expectTypeOf<IsString<number>>().toEqualTypeOf<false>()
  })

  it('should check if a string is empty', () => {
    expectTypeOf<IsEmptyString<''>>().toEqualTypeOf<true>()
    expectTypeOf<IsEmptyString<'hello'>>().toEqualTypeOf<false>()
  })

  it('should check if a value is an array', () => {
    expectTypeOf<IsArray<any[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsArray<readonly any[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsArray<string>>().toEqualTypeOf<false>()
  })

  it('should check if a value is a tuple', () => {
    expectTypeOf<IsTuple<[1, 2]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTuple<number[]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTuple<readonly [1, 2]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTuple<readonly number[]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTuple<string>>().toEqualTypeOf<false>()
  })

  it('should check if a tuple is empty', () => {
    expectTypeOf<IsTupleEmpty<[]>>().toEqualTypeOf<true>()
    expectTypeOf<IsTupleEmpty<[1]>>().toEqualTypeOf<false>()
    expectTypeOf<IsTupleEmpty<readonly []>>().toEqualTypeOf<true>()
    expectTypeOf<IsTupleEmpty<readonly [1]>>().toEqualTypeOf<false>()
  })

  it('should check if two values are equal', () => {
    expectTypeOf<IsEqual<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsEqual<1, 2>>().toEqualTypeOf<false>()
    expectTypeOf<IsEqual<1, number>>().toEqualTypeOf<true>()
  })

  it('should check if two values are not equal', () => {
    expectTypeOf<IsNotEqual<1, 1>>().toEqualTypeOf<false>()
    expectTypeOf<IsNotEqual<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsNotEqual<1, number>>().toEqualTypeOf<false>()

  })

  it('should check if two values are strictly equal', () => {
    expectTypeOf<IsStrictEqual<1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsStrictEqual<1, 2>>().toEqualTypeOf<false>()
    expectTypeOf<IsStrictEqual<1, number>>().toEqualTypeOf<false>()
  })

  it('should check if two values are strictly not equal', () => {
    expectTypeOf<IsStrictNotEqual<1, 1>>().toEqualTypeOf<false>()
    expectTypeOf<IsStrictNotEqual<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsStrictNotEqual<1, number>>().toEqualTypeOf<true>()
  })

  it('should check if a number is zero', () => {
    expectTypeOf<IsZero<0>>().toEqualTypeOf<true>()
    expectTypeOf<IsZero<1>>().toEqualTypeOf<false>()
  })

  it('should check if a value is a number', () => {
    expectTypeOf<IsNumber<number>>().toEqualTypeOf<true>()
    expectTypeOf<IsNumber<1>>().toEqualTypeOf<false>()
  })

  it('should check if a number is positive', () => {
    expectTypeOf<IsPositive<1>>().toEqualTypeOf<true>()
    expectTypeOf<IsPositive<-1>>().toEqualTypeOf<false>()
  })

  it('should check if a number is negative', () => {
    expectTypeOf<IsNegative<1>>().toEqualTypeOf<false>()
    expectTypeOf<IsNegative<-1>>().toEqualTypeOf<true>()
  })

  it('should check if a number is an integer', () => {
    expectTypeOf<IsInteger<1>>().toEqualTypeOf<true>()
    expectTypeOf<IsInteger<1.1>>().toEqualTypeOf<false>()
  })

  it('should check if a number is a decimal', () => {
    expectTypeOf<IsDecimal<1>>().toEqualTypeOf<false>()
    expectTypeOf<IsDecimal<1.1>>().toEqualTypeOf<true>()
  })

  it('should check if all numbers are zero', () => {
    expectTypeOf<IsAllZero<0, 0>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllZero<0, 1>>().toEqualTypeOf<false>()
  })

  it('should check if all numbers are positive', () => {
    expectTypeOf<IsAllPositive<1, 2>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllPositive<1, -1>>().toEqualTypeOf<false>()
  })

  it('should check if all numbers are negative', () => {
    expectTypeOf<IsAllNegative<-1, -2>>().toEqualTypeOf<true>()
    expectTypeOf<IsAllNegative<1, -1>>().toEqualTypeOf<false>()
  })

  it('should check if any number is zero', () => {
    expectTypeOf<IsAnyZero<0, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyZero<1, 1>>().toEqualTypeOf<false>()
  })

  it('should check if any number is a number', () => {
    expectTypeOf<IsAnyNumber<1, number>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyNumber<1, 2>>().toEqualTypeOf<false>()
  })

  it('should check if any number is positive', () => {
    expectTypeOf<IsAnyPositive<1, -1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyPositive<-1, -1>>().toEqualTypeOf<false>()
  })

  it('should check if any number is negative', () => {
    expectTypeOf<IsAnyNegative<-1, 1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyNegative<1, 1>>().toEqualTypeOf<false>()
  })

  it('should check if any number is a decimal', () => {
    expectTypeOf<IsAnyDecimal<1, 1.1>>().toEqualTypeOf<true>()
    expectTypeOf<IsAnyDecimal<1, 2>>().toEqualTypeOf<false>()
  })

  it('should exclude empty objects', () => {
    expectTypeOf<ExcludeEmptyObject<{} | []>>().toEqualTypeOf<[]>()
  })

  it('should exclude empty arrays', () => {
    expectTypeOf<ExcludeEmptyArray<{} | []>>().toEqualTypeOf<{}>()
  })
}

