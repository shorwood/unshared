import type { Function } from './Function'
import type { Unique } from './Unique'

/**
 * Tuple of all possible overloads of a function. This is useful when you want to
 * destructure the parameters and return type of a function.
 *
 * For this to work, you must enable `strictFunctionTypes` in your `tsconfig.json`.
 * Otherwise, this type will infer the overloads incorrectly.
 *
 * @template T The type of the function.
 * @returns The union of all overloads.
 * @example
 * declare function foo(x: number): boolean
 * declare function foo(x: string): boolean
 * Overloads<typeof foo> // [(x: number) => boolean, (x: string) => boolean]
 */
export type Overloads<T extends Function<any, any[]>> =
T extends {
  (...p: infer P1): infer R1
  (...p: infer P2): infer R2
  (...p: infer P3): infer R3
  (...p: infer P4): infer R4
  (...p: infer P5): infer R5
  (...p: infer P6): infer R6
  (...p: infer P7): infer R7
  (...p: infer P8): infer R8
  (...p: infer P9): infer R9
  (...p: infer P10): infer R10
}
  ? Unique<[
    (...p: P1) => R1,
    (...p: P2) => R2,
    (...p: P3) => R3,
    (...p: P4) => R4,
    (...p: P5) => R5,
    (...p: P6) => R6,
    (...p: P7) => R7,
    (...p: P8) => R8,
    (...p: P9) => R9,
    (...p: P10) => R10,
  ]>
  : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a single signature if function has no overloads', () => {
    type Method = (a: string, b: string) => boolean
    type Result = Overloads<Method>
    expectTypeOf<Result>().toEqualTypeOf<[Method]>()
  })

  test('should return a union of signatures if function has 2 overloads', () => {
    interface Method {
      (a: number, b: number): boolean
      (a: string, b: number): boolean
    }
    type Result = Overloads<Method>
    type Expected = [
      (a: number, b: number) => boolean,
      (a: string, b: number) => boolean,
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a union of signatures if function has 10 overloads', () => {
    interface Method {
      (a: number, b: string): boolean
      (a: string, b: number): boolean
      (a: number, b: number): boolean
      (a: string, b: string): boolean
      (a: number, b: string, c: number): boolean
      (a: string, b: number, c: number): boolean
      (a: number, b: number, c: number): boolean
      (a: string, b: string, c: number): boolean
      (a: number, b: string, c: string): boolean
      (a: string, b: number, c: string): boolean
    }
    type Result = Overloads<Method>
    type Expected = [
      (a: number, b: string) => boolean,
      (a: string, b: number) => boolean,
      (a: number, b: number) => boolean,
      (a: string, b: string) => boolean,
      (a: number, b: string, c: number) => boolean,
      (a: string, b: number, c: number) => boolean,
      (a: number, b: number, c: number) => boolean,
      (a: string, b: string, c: number) => boolean,
      (a: number, b: string, c: string) => boolean,
      (a: string, b: number, c: string) => boolean,
    ]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
