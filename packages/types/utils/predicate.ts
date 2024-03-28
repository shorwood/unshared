import { BooleanAnd } from '../BooleanAnd'
import { BooleanOr } from '../BooleanOr'

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
export type IsString<S extends string> = string extends S ? true : false
export type IsEmptyString<S extends string> = S extends '' ? true : false

// --- Predicate array and tuple
export type IsArray<T> = any[] extends T ? true : readonly any[] extends T ? true : false
export type IsTuple<T> = [...any[]] extends T ? true : readonly [...any[]] extends T ? true : false
export type IsTupleEmpty<T extends any[]> = T extends [] ? true : false
export type IsArrayOrTuple<T> = BooleanOr<IsArray<T>, IsTuple<T>>

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
