import type { Constructor } from './Constructor'
import type { ConstructorStatics } from './ConstructorStatics'
import type { DefaultObject } from './DefaultObject'
import type { UnionMerge } from './UnionMerge'

/**
 * Extends one class with another. The first class will be extended with the
 * second class. Meaning that the first class will override the second class.
 *
 * @template T1 The class to extend.
 * @template T2 The class to extend with.
 * @returns A new class that extends both classes.
 * @example
 * class A { a = 1, c = 3 }
 * class B { b = 2, c = '3' }
 * type C = Extends<A, B> // { a: number; b: number; c: number; }
 */
export type Extends<T1 extends Constructor, T2 extends Constructor> =
  Constructor<
    UnionMerge<DefaultObject<InstanceType<T1>, InstanceType<T2>, 0>>,
    ConstructorParameters<T1>,
    UnionMerge<DefaultObject<ConstructorStatics<T2>, ConstructorStatics<T1>, 0>>
  >
