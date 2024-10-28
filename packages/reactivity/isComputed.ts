import type { Computed } from './computed'
import { ComputedFlag } from './constants'

/**
 * Predicate function that checks if a value is a `Computed` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Computed` object.
 * @example
 * const value = computed([], () => 1)
 * isComputed(value) // => true
 */
export function isComputed<T>(value: unknown): value is Computed<T> {
  return typeof value === 'object'
    && value !== null
    && ComputedFlag in value
    && value[ComputedFlag] === true
}
