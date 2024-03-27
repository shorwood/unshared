import { Function } from './Function'
import { Overloads } from './Overloads'

/**
 * Extract the parameters of all functions in a tuple.
 */
type ExtractTupleParameters<T extends Array<Function<any, any[]>>> = {
  [K in keyof T]: T[K] extends (...args: infer P) => any ? P : never
}[number]

/**
 * Extract the parameters from the signatures of a function with overloads.
 *
 * @template T The function type.
 * @example
 * function add(a: number, b: number): number
 * function add(a: string, b: string): string
 * type Result = OverloadsParameters<typeof add> // [number, number] | [string, string]
 */
export type OverloadsParameters<T extends Function<any, any[]>> = ExtractTupleParameters<Overloads<T>>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the parameters of a function with no overloads', () => {
    type Method = (a: number, b: string) => boolean
    type Result = OverloadsParameters<Method>
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>()
  })

  it('should infer the parameters of a function with multiple overloads', () => {
    interface Method {
      (a: number, b: string): string
      (a: string, b: number): number
    }
    type Result = OverloadsParameters<Method>
    expectTypeOf<Result>().toEqualTypeOf<[number, string] | [string, number]>()
  })
}
