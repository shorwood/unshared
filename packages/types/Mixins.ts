import type { Constructor } from './Constructor'
import type { Extends } from './Extends'

/**
 * Mixes multiple classes into a single class from left to right.
 *
 * @template T An array of classes to mix.
 * @returns A single class that extends all classes.
 * @example
 * class A { a = 1 }
 * class B { b = 2 }
 * class C { c = 3 }
 * type C = Mixins<[A, B, C]> // { a: number, b: number, c: number }
 */
export type Mixins<T extends Constructor[]> =
  T extends [infer T1 extends Constructor] ? T1
    : T extends [infer T1 extends Constructor, infer T2 extends Constructor] ? Extends<T1, T2>
      : T extends [infer T1 extends Constructor, ...infer TRest extends Constructor[]] ? Extends<T1, Mixins<TRest>>
        : never
