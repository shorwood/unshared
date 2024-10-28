import type { Reactive } from './reactive'
import { ReactiveFlag } from './constants'

/**
 * Predicate function that checks if a value is a `Reactive` object.
 *
 * @param value The value to check.
 * @returns `true` if the value is a `Reactive` object.
 * @example
 * const value = reactive({})
 * isReactive(value) // => true
 */
export function isReactive<T>(value: unknown): value is Reactive<T> {
  return typeof value === 'object'
    && value !== null
    && ReactiveFlag in value
    && value[ReactiveFlag] === true
}
