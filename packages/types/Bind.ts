import { TupleSlice } from './TupleSlice'
import { TupleLength } from './TupleLength'
import { Function } from './Function'

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

/** v8 ignore start */
if (import.meta.vitest) {
  test('should return the type as is if no parameters are provided', () => {
    type Result = Bind<(x: number, y: number) => boolean>
    type Expected = (x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a bound function as is if no other parameters are provided', () => {
    type Result = Bind<(this: string, x: number, y: number) => boolean>
    type Expected = (this: string, x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should bind the this parameter if using named tuple parameters', () => {
    type Result = Bind<(x: number, y: number) => boolean, [this: string]>
    type Expected = (this: string, x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should bind the this parameter and append the other parameters', () => {
    type Result = Bind<(x: number, y: number) => boolean, [this: string, x: string]>
    type Expected = (this: string, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should only bind the parameters if no this parameter is provided', () => {
    type Result = Bind<(x: number, y: number) => boolean, [undefined, x: string]>
    type Expected = (y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}

