import type { Function } from './Function'
import type { Overloads } from './Overloads'

/**
 * Extract the return types of all functions in a tuple.
 */
type ExtractTupleReturnTypes<T extends Function[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer P ? P : never
}[number]

/**
 * Extract the return types from the signatures of a function with overloads.
 *
 * @template T The function type.
 * @example
 * function add(a: number, b: number): number
 * function add(a: string, b: string): string
 * type Result = OverloadsParameters<typeof add> // [number, number] | [string, string]
 */
export type OverloadsReturnTypes<T extends Function> = ExtractTupleReturnTypes<Overloads<T>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the parameters of a function', () => {
    type Method = (a: number, b: string) => boolean
    type Result = OverloadsReturnTypes<Method>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  it('should infer the parameters of a function with overloads', () => {
    interface Method {
      (a: number, b: string): string
      (a: string, b: number): number
    }
    type Result = OverloadsReturnTypes<Method>
    expectTypeOf<Result>().toEqualTypeOf<string | number>()
  })
}
