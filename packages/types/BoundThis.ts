/**
 * A function where the first parameter is already bound to `this`.
 *
 * @template F The function to bind.
 * @example BoundThis<(x: number, y: string) => boolean> // (this: number, y: string) => boolean
 */
export type BoundThis<F extends Function> = F extends (...parameters: infer P) => infer U
  ? P extends [infer T, ...infer R] ? (this: T, ...parameters: R) => U : F
  : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should bind "this" to the first parameter of a function', () => {
    type Result = BoundThis<(x: number, y: string) => boolean>
    type Expected = (this: number, y: string) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should bind "this" to the first parameter of a function with no parameters', () => {
    type Result = BoundThis<() => boolean>
    type Expected = () => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
