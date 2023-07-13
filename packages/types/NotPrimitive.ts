import { Any } from './Any'
import { Primitive } from './Primitive'

/**
 * Exclude primitive types from a type.
 */
export type NotPrimitive<U = Any> = U extends Primitive ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should exclude primitives', () => {
    type Result = NotPrimitive<string | number | {}>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })

  it('should match non-primitives', () => {
    expectTypeOf<{}>().toMatchTypeOf<NotPrimitive>()
  })

  it('should not match primitives', () => {
    expectTypeOf<string>().not.toMatchTypeOf<NotPrimitive>()
  })
}
