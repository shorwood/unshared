/**
 * Utilities bellow are thanks to [Ryan Dabler](https://medium.com/@ryan.dabler)
 * and his [article about TypeScript Arithmetics](https://medium.com/itnext/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f)
 */
import { Tuple } from '../Tuple'
import { MathAdd } from '../MathAdd'
import { TupleLength } from '../TupleLength'

/** Checks if both values are positive integers or zero */
export type AllPositive<A extends number, B extends number> =
  A extends `-${number}` ? false : B extends `-${number}` ? false : true

/** Checks if all values are negative integers */
export type AllNegative<A extends number, B extends number> =
  `${A}` extends `-${number}` ? `${B}` extends `-${number}` ? true : false : false

/** Checks if any value is negative */
export type AnyIsNegative<A extends number, B extends number> =
  `${A}` extends `-${number}` ? true : `${B}` extends `-${number}` ? true : false

/** Are we at the end of the recursion? */
export type AnyIsZero<A extends number, B extends number> =
    A extends 0 ? true : B extends 0 ? true : false

/** Are two numbers equal? */
export type AreEquals<A, B> =
    A extends B ? B extends A ? true : false : false

/** Checks if any value is `number` */
export type AnyIsNumber<A extends number, B extends number> =
  number extends A ? true : number extends B ? true : false

/** Is `A` less than `B`? */
export type IsLowerThan<A extends number, B extends number> =
  AnyIsZero<A, B> extends true
    ? AreEquals<A, B> extends true ? false : (A extends 0 ? true : false)
    : IsLowerThan<InternalSubtract<A, 1>, InternalSubtract<B, 1>>

/** Sum of two integers using tuples */
export type InternalAdd<A extends number, B extends number> =
  TupleLength<[...Tuple<A>, ...Tuple<B>]> extends infer U ? U : never

/** Subtracts two integers using tuples */
export type InternalSubtract<A extends number, B extends number> =
  Tuple<A> extends [...(infer U), ...Tuple<B>] ? TupleLength<U> : never

/** Negates a positive */
export type InternalNegate<A extends number> =
  `-${A}` extends `${infer U extends number}` ? U : never

/** Adds two integers and handles negative numbers */
export type InternalAddOneNegative<A extends number, B extends number> =
  `${A}` extends `-${infer U extends number}`
    ? IsLowerThan<U, B> extends true ? InternalSubtract<B, U>
      : AreEquals<U, B> extends true ? 0
        : InternalNegate<InternalSubtract<U, B>>
    : `${B}` extends `-${number}`
      ? InternalAddOneNegative<B, A>
      : never

/** Adds two integers and handles negative numbers */
export type InternalAddAllNegative<A extends number, B extends number> =
  `${A}` extends `-${infer U extends number}` ? `${B}` extends `-${infer V extends number}`
    // @ts-expect-error: garanteed to be a number
    ? InternalNegate<InternalAdd<U, V>>
    : never : never

/** Recursively adds `N` to `A` `I` times */
export type MultiAdd<N extends number, A extends number, I extends number> =
  I extends 0 ? A
    : MathAdd<N, A> extends number
      ? MultiAdd<N, MathAdd<N, A>, InternalSubtract<I, 1>>
      : never

/** Multiplies two positive integers */
export type MultiSub<N extends number, D extends number, Q extends number> =
IsLowerThan<N, D> extends true ? Q
  : InternalAdd<Q, 1> extends number
    ? MultiSub<InternalSubtract<N, D>, D, InternalAdd<Q, 1>>
    : never
