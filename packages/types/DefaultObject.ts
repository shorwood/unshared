import { Default } from './Default'
import { DefaultValue } from './DefaultValue'
import { MathDecrease } from './MathDecrease'
import { IsZero } from './utils/predicate'

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
  [P in (keyof T | keyof U)]-?: P extends keyof T
    ? P extends keyof U
      ? IsZero<N> extends true
        ? DefaultValue<T[P], U[P]>
        : Default<T[P], U[P], MathDecrease<N>>
      : T[P]
    : P extends keyof U ? U[P] : never
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default undefined properties', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  it('should default optional properties', () => {
    type Result = DefaultObject<{ a?: number }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  it('should default null properties', () => {
    type Result = DefaultObject<{ a: number | null }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  it('should default null to undefined', () => {
    type Result = DefaultObject<{ a: number | null }, { a: undefined; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number | undefined; b: 2 }>()
  })

  it('should default undefined to null', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: null; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number | null; b: 2 }>()
  })

  it('should default nested objects', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 1>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number; c: 2 } }>()
  })

  it('should not default nested objects', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 0>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number | undefined } }>()
  })
}
