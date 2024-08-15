import type { Pretty } from './Pretty'

/**
 * Make all properties of T optionally `undefined`. This type is
 * similar to `Partial` but it only makes properties optional. Meaning
 * they key must still exist in the object.
 *
 * @template T The type to make optional.
 * @template K The subset of properties to make optional.
 * @returns A new type with all properties of T optionally `undefined`
 * @example PartialStrict<{ a: string, b: number }> // { a: string | undefined, b: number | undefined }
 */
export type PartialStrict<T, K extends keyof T = keyof T> =
  Pretty<{ [P in Exclude<keyof T, K>]: T[P] }& { [P in K]-?: T[P] | undefined }>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should make all properties of T optionally `undefined`', () => {
    type Result = PartialStrict<{ a: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number | undefined }>()
  })

  test('should make some properties of T optionally `undefined`', () => {
    type Result = PartialStrict<{ a: string; b: number }, 'a'>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number }>()
  })
}
