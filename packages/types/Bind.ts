import type { Function } from './Function'
import type { TupleLength } from './TupleLength'
import type { TupleSlice } from './TupleSlice'

/**
 * A function where the first parameter is already bound to `this`.
 *
 * @template T The function to bind.
 * @example BoundThis<(x: number, y: string) => boolean> // (this: number, y: string) => boolean
 */
export type Bind<T extends Function, P extends unknown[] = []> =
  P extends [] ? T

    // --- If only the this parameter is provided, bind it to the function.
    : P extends [this: infer This]
      ? (this: This, ...parameters: Parameters<T>) => ReturnType<T>

      // --- If the this parameter is provided as well as other parameters, bind the this parameter and append the other parameters.
      : P extends [this: infer This, ...infer R]
        ? (this: This, ...parameters: TupleSlice<Parameters<T>, TupleLength<R>>) => ReturnType<T>

        // --- Otherwise, just bind the parameters.
        : (...parameters: TupleSlice<Parameters<T>, TupleLength<P>>) => ReturnType<T>
