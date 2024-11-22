/**
 * Make all nested properties in T writeable. This type reverses the effects of the
 * `readonly` modifier and is the opposite of the `Readonly` type.
 *
 * @template T The type to make writeable
 * @returns A new type with all properties in T writeable
 * @example Writeable<{ readonly a: string; b: { readonly c: number } }> // { a: string; b: { c: number } }
 */
export type WriteableDeep<T> =
T extends object
  ? T extends ReadonlyArray<infer U> ? Array<WriteableDeep<U>>
    : { -readonly [P in keyof T]: WriteableDeep<T[P]>; } : T
