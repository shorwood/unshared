import { IsZero, Substract } from '@unshared/types'
import { DefaultValue } from './DefaultValue'
import { Default } from './Default'

/**
 * Default the properties of an object by the properties of another object.
 * Meaning that if the first object has a property that is undefined or null,
 * the second object's property will be used instead.
 *
 * @template T1 The object to default
 * @template T2 The object to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted object
 */
export type DefaultObject<T1 extends object, T2 extends object, N extends number = 0> =
{
  [P in (keyof T1 | keyof T2)]-?:
  P extends keyof T1 ? P extends keyof T2
    ? IsZero<N> extends true
      ? DefaultValue<T1[P], T2[P]>
      : Default<T1[P], T2[P], Substract<N, 1>>
    : T1[P]
    : P extends keyof T2 ? DefaultValue<undefined, T2[P]> : never
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should default undefined properties', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default optional properties', () => {
    type Result = DefaultObject<{ a?: number }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default null properties', () => {
    type Result = DefaultObject<{ a: null | number }, { a: 1; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
  })

  test('should default null to undefined', () => {
    type Result = DefaultObject<{ a: null | number }, { a: undefined; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number | undefined; b: 2 }>()
  })

  test('should default undefined to null', () => {
    type Result = DefaultObject<{ a: number | undefined }, { a: null; b: 2 }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: null | number; b: 2 }>()
  })

  test('should default nested objects', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 1>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number; c: 2 } }>()
  })

  test('should not default nested objects after the depth is reached', () => {
    type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 0>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number | undefined } }>()
  })
}
