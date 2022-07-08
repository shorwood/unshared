import { PositiveInteger } from './number'
import { Length, Tuple } from './tuple'

/**
 * Utilities bellow are thanks to [Ryan Dabler](https://medium.com/@ryan.dabler)
 * and his [article about TypeScript Arithmetics](https://medium.com/itnext/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f)
 */

type MultiAdd<N extends number, A extends number, I extends number> = I extends 0
  ? A
  : Add<N, A> extends number ? MultiAdd<N, Add<N, A>, Subtract<I, 1>> : never

type AtTerminus<A extends number, B extends number> = A extends 0
  ? true
  : (B extends 0 ? true : false)

type EQ<A, B> = A extends B
  ? (B extends A ? true : false)
  : false

type LT<A extends number, B extends number> = AtTerminus<A, B> extends true
  ? EQ<A, B> extends true ? false : (A extends 0 ? true : false)
  : LT<Subtract<A, 1>, Subtract<B, 1>>

type MultiSub<N extends number, D extends number, Q extends number> = LT<N, D> extends true
  ? Q
  : Add<Q, 1> extends number ? MultiSub<Subtract<N, D>, D, Add<Q, 1>> : never

/** Checks if both values are positive integers */
type ArePositiveInteger<A extends number, B extends number> = A extends PositiveInteger<A>
  ? (B extends PositiveInteger<B> ? true : false)
  : false

/** Addition of two positive integers */
export type Add<A extends number, B extends number> = ArePositiveInteger<A, B> extends true
  ? Length<[...Tuple<A>, ...Tuple<B>]>
  : never

/**
 * Substraction of two positive integers
 * @param A The first positive integer
 * @param B The second positive integer
 * @returns The difference of the two positive integers
 */
export type Subtract<A extends number, B extends number> =
  ArePositiveInteger<A, B> extends true
    ? Tuple<A> extends [...(infer U), ...Tuple<B>]
      ? Length<U>
      : never
    : never

/**
 * Multiple of two positive integers
 * @param A The first positive integer
 * @param B The second positive integer
 * @returns The product of the two positive integers
 */
export type Multiply<A extends number, B extends number> =
  ArePositiveInteger<A, B> extends true
    ? MultiAdd<A, 0, B>
    : never

/**
 * Euclidian division of two positive integers
 * @param A The first positive integer
 * @param B The second positive integer
 * @returns The quotient of the two positive integers
 */
export type Divide<A extends number, B extends number> =
  ArePositiveInteger<A, B> extends true
    ? MultiSub<A, B, 0>
    : never

/**
 * Modulo of two positive integers
 * @param A The first positive integer
 * @param B The second positive integer
 * @returns The remainder of the division of the two positive integers
 */
export type Modulo<A extends number, B extends number> =
  ArePositiveInteger<A, B> extends true
    ? LT<A, B> extends true ? A : Modulo<Subtract<A, B>, B>
    : never

/**
 * Number increased by 1
 * @param A The number
 * @returns The number increased by 1
 */
export type Increase<N extends number> = Add<N, 1>

/**
 * Number decreased by 1
 * @param N The number to decrease
 * @returns The number decreased by 1
 */
export type Decrease<N extends number> = Subtract<N, 1>
