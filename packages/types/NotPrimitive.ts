import type { Any } from './Any'
import type { Primitive } from './Primitive'

/**
 * Exclude primitive types from a type.
 */
export type NotPrimitive<U = Any> = U extends Primitive ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude primitives', () => {
    type Result = NotPrimitive<number | object | string>
    expectTypeOf<Result>().toEqualTypeOf<object>()
  })

  test('should match non-primitives', () => {
    expectTypeOf<object>().toMatchTypeOf<NotPrimitive>()
  })

  test('should not match primitives', () => {
    expectTypeOf<string>().not.toMatchTypeOf<NotPrimitive>()
  })
}
