import { Function } from './Function'
import { Primitive } from './Primitive'

/**
 * Matches all types except `unknown`.
 */
export type Any = Primitive | object | Function

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match all values exept unknown', () => {
    type Result = Any
    type Expected = Function | bigint | boolean | number | object | string | symbol | null | undefined
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should not match unknown', () => {
    type Result = Any
    expectTypeOf<Result>().not.toEqualTypeOf<unknown>()
  })
}
