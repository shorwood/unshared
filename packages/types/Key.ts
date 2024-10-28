/**
 * Extract the keys of an object.
 *
 * @template T The object to extract the keys from
 * @returns The keys of the object
 */
export type Key<T = unknown> =
  T extends Iterable<any> ? number
    : T extends object ? keyof T
      : PropertyKey
