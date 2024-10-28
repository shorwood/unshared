/**
 * Map the properties of a collection to a new value type.
 *
 * @template T Type of the collection.
 * @template U Type to map the properties to.
 * @returns A collection with the same keys but the new properties type.
 * @example MapValues<{ foo: string }, number> // { foo: number }
 */
export type MapValues<T extends object, U> =
  T extends object ? { [P in keyof T]: U } : never
