import { Default } from './Default'
import { DefaultValue } from './DefaultValue'
import { MathDecrease } from './MathDecrease'

/**
 * Default the properties of an object by the properties of another object.
 * Meaning that if the first object has a property that is undefined or null,
 * the second object's property will be used instead.
 *
 * @template T The object to default
 * @template U The object to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted object
 */
export type DefaultObject<T extends object, U extends object, N extends number = 0> =
{
  [P in (keyof T | keyof U)]: P extends keyof T
    ? P extends keyof U
      ? 0 extends N
        ? DefaultValue<T[P], U[P]>
        : Default<T[P], U[P], MathDecrease<N>>
      : T[P]
    : P extends keyof U ? U[P] : never
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default object from undefined properties', () => {
    type result = DefaultObject<{ a: number | undefined }, { a: 1; b: 2 }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  it('should default object from null properties', () => {
    type result = DefaultObject<{ a: number | null }, { a: 1; b: 2 }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  it('should default null to undefined', () => {
    type result = DefaultObject<{ a: number | null }, { a: undefined; b: 2 }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number | undefined; b: 2 }>()
  })

  it('should default undefined to null', () => {
    type result = DefaultObject<{ a: number | undefined }, { a: null; b: 2 }>
    expectTypeOf<result>().toEqualTypeOf<{ a: number | null; b: 2 }>()
  })

  it('should default nested objects', () => {
    type result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 1>
    expectTypeOf<result>().toEqualTypeOf<{ a: { b: number; c: 2 } }>()
  })

  it('should not default nested objects', () => {
    type result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 0>
    expectTypeOf<result>().toEqualTypeOf<{ a: { b: number | undefined } }>()
  })
}
