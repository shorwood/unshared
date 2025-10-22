import type { Constructor } from '@unshared/types'

/**
 * Predicate to determine if a value is a constructor function.
 *
 * @param value The value to test.
 * @returns `true` if the value is a constructor function.
 * @example isConstructor(Boolean) // true
 */
export function isConstructor<T extends Constructor>(value: unknown): value is T {
  return typeof value === 'function'
    // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
    && value.prototype?.constructor === value
}
