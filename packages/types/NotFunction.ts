import { Any } from "./Any"

/**
 * A type that is not a function.
 *
 * @example NotFunction & Function // never
 */
export type NotFunction = Any & { apply?: never }

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a non-function', () => {
    type test = number
    type result = NotFunction
    expectTypeOf<test>().toMatchTypeOf<result>()
  })

  it('should not match a function', () => {
    type test = () => void
    type result = NotFunction
    expectTypeOf<test>().not.toMatchTypeOf<result>()
  })
}
