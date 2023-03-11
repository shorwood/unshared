import { Function } from './Function'
import { Primitive } from './Primitive'

/**
 * Matches all values exept `unknown`.
 */
export type Any = Primitive | object | Function

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match all values exept unknown', () => {
    type result = Any
    type expected = number | string | boolean | bigint | symbol | undefined | null | object | Function
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should not match unknown', () => {
    type result = Any
    expectTypeOf<result>().not.toEqualTypeOf<unknown>()
  })
}
