import { Primitive } from './Primitive'
import { Any } from './Any'

/**
 * Exclude primitive types from a type.
 */
export type NotPrimitive<U = Any> = U extends Primitive ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude primitives', () => {
    type Result = NotPrimitive<{} | number | string>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  test('should match non-primitives', () => {
    expectTypeOf<{}>().toMatchTypeOf<NotPrimitive>()
  })

  test('should not match primitives', () => {
    expectTypeOf<string>().not.toMatchTypeOf<NotPrimitive>()
  })
}
