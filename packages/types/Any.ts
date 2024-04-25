import { Primitive } from './Primitive'
import { Function } from './Function'

/**
 * Matches all types except `unknown`.
 */
export type Any = Function | Primitive | object

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match all values exept unknown', () => {
    type Result = Any
    type Expected = Function | bigint | boolean | null | number | object | string | symbol | undefined
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should not match unknown', () => {
    type Result = Any
    expectTypeOf<Result>().not.toEqualTypeOf<unknown>()
  })
}
