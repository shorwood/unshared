/**
 * Predicate to check if a value is iterable. Meaning it has a `Symbol.iterator`
 * property that is a function.
 *
 * @param value The value to check.
 * @returns `true` if the value is iterable, `false` otherwise.
 * @example
 * // Check if an array is iterable.
 * isIterable([]) // => true
 *
 * // Check if an object is iterable.
 * isIterable({}) // => false
 */
export function isIterable<T = any>(value: unknown): value is Iterable<T> {
  return typeof value === 'object'
    && value !== null
    && Symbol.iterator in value
    && typeof value[Symbol.iterator] === 'function'
}
