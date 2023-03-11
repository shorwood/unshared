import { Tuple } from '../Tuple'
import { TupleLength } from '../TupleLength'
import { BooleanAnd } from '../BooleanAnd'
import { BooleanOr } from '../BooleanOr'

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

// --- Arithmetics
export type Add<A extends number, B extends number> = TupleLength<[...Tuple<A>, ...Tuple<B>]> extends infer U extends number ? U : never
export type Substract<A extends number, B extends number> = Tuple<A> extends [...(infer U), ...Tuple<B>] ? TupleLength<U> : never
export type Absolute<A extends number> = `${A}` extends `-${infer U extends number}` ? U : A
export type Negative<A extends number> = `-${A}` extends `${infer U extends number}` ? U : `${A}` extends `-${infer V extends number}` ? V : never

// --- Comparisons
export type IsEqual<A, B> = A extends B ? B extends A ? true : false : false

export type IsGreaterOrEqualThan<A extends number, B extends number> = BooleanOr<IsEqual<A, B>, IsGreaterThan<A, B>>
export type IsGreaterThan<A extends number, B extends number> =
  IsEqual<A, B> extends true ? false
    : IsZero<A> extends true ? false
      : IsZero<B> extends true ? true
        : IsGreaterThan<Substract<A, 1>, Substract<B, 1>>

export type IsLowerOrEqualThan<A extends number, B extends number> = BooleanOr<IsEqual<A, B>, IsLowerThan<A, B>>
export type IsLowerThan<A extends number, B extends number> =
  IsEqual<A, B> extends true ? false
    : IsZero<A> extends true ? true
      : IsZero<B> extends true ? false
        : IsLowerThan<Substract<A, 1>, Substract<B, 1>>

/** Adds two integers and handles negative numbers */
export type AddOneNegative<A extends number, B extends number> =
  `${A}` extends `-${infer U extends number}`
    ? IsLowerThan<U, B> extends true ? Substract<B, U>
      : IsEqual<U, B> extends true ? 0
        : Absolute<Substract<U, B>>
    : `${B}` extends `-${number}`
      ? AddOneNegative<B, A>
      : never

/** Adds two integers and handles negative numbers */
export type AddIsAllNegative<A extends number, B extends number> =
  `${A}` extends `-${infer U extends number}` ? `${B}` extends `-${infer V extends number}`
    ? Absolute<Add<U, V>>
    : never : never

export type Divide<A extends number, B extends number, Q extends number = 0> =
  IsLowerThan<A, B> extends true ? Q
    : Add<Q, 1> extends number ? Divide<Substract<A, B>, B, Add<Q, 1>>
      : never

export type Multiply<A extends number, B extends number, P extends number = 0> =
  IsZero<B> extends true ? P
    :Add<A, P> extends number ? Multiply<A, Substract<B, 1>, Add<A, P>>
      : never

export type Modulo<A extends number, B extends number, R extends number = 0> =
  IsLowerThan<A, B> extends true ? A
    : Add<R, 1> extends number ? Modulo<Substract<A, B>, B, Add<R, 1>>
      : never
