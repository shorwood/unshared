import type { Pretty } from './Pretty'

/**
 * Make properties of T optionally `undefined`. This type is similar to `Partial` but
 * but the property must be present in T. It's also possible to specify which properties
 * should be made optional.
 *
 * @template T The type to make optional.
 * @template K The keys of T to make optional. If not provided, all keys are made optional.
 * @returns A new type with all properties of T optionally `undefined`
 * @example
 *
 * // Make all properties of T optionally `undefined`
 * Optional<{ a: string, b: number }> // { a: string | undefined, b: number | undefined }
 *
 * // Make some properties of T optionally `undefined`
 * Optional<{ a: string, b: number }, 'a'> // { a: string | undefined, b: number }
 */
export type Optional<T, K extends keyof T = keyof T> =
  Pretty<
    { [P in Exclude<keyof T, K> ]: T[P] } &
    { [P in K]: T[P] | undefined }
  >

/* v8 ignore next */
if (import.meta.vitest) {
  test('should make all properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number | undefined }>()
  })

  test('should make partial properties of T optionally `undefined`', () => {
    type Result = Optional<{ a?: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string | undefined ; b: number | undefined }>()
  })

  test('should make only some properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }, 'a'>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number }>()
  })

  test('should make no properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }, never>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>()
  })
}
