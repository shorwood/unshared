import type { BooleanNor } from '../BooleanNor'
import type { BooleanNot } from '../BooleanNot'
import type { BooleanOr } from '../BooleanOr'
import type { Tuple } from '../Tuple'
import type { TupleLength } from '../TupleLength'
import type { IsEqual, IsStrictEqual, IsZero } from './predicate'

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

// --- Decrement/Increase using lookup tables
// --- Mainly useful for limiting recursion depth.
interface DecrementLookup { 0: never; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4; 6: 5; 7: 6; 8: 7 }
interface IncrementLookup { 0: 1; 1: 2; 2: 3; 3: 4; 4: 5; 5: 6; 6: 7; 7: 8 }
export type Decrement<N extends number> = N extends keyof DecrementLookup ? DecrementLookup[N] : Substract<N, 1>
export type Increment<N extends number> = N extends keyof IncrementLookup ? IncrementLookup[N] : Add<N, 1>

// --- Number predicate. (No range safety).
export type IsLower<A extends number, B extends number> = Substract<A, B> extends never ? true : false
export type IsGreater<A extends number, B extends number> = BooleanNor<IsLower<A, B>, IsEqual<A, B>>
export type IsEqualOrLower<A extends number, B extends number> = BooleanOr<IsStrictEqual<A, B>, IsLower<A, B>>
export type IsEqualOrGreater<A extends number, B extends number> = BooleanNot<IsLower<A, B>>
export type IsDivisibleBy<A extends number, B extends number> = IsStrictEqual<Modulo<Absolute<A>, Absolute<B>>, 0>
