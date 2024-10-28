import type { Reference } from './reference'
import { ReferenceFlag } from './constants'

/**
 * Predicate for checking if a value is a `Reference` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Reference` object.
 * @example
 * const value = reference('foo')
 * isReference(value) // => true
 */
export function isReference<T>(value: unknown): value is Reference<T> {
  return typeof value === 'object'
    && value !== null
    && ReferenceFlag in value
    && value[ReferenceFlag] === true
}
