import type { RuleLike } from './createRule'
import { createRule } from './createRule'

/**
 * Checks if the value is a `ValidationRule`.
 *
 * @param value The value to check
 * @returns whether or not the value is a `ValidationRule`
 * @example
 *
 * // Create a rule
 * const isGreaterThan = x => x > 0
 *
 * // Check if the rule is valid
 * isRuleLike([isGreaterThan, 1]) // => true
 */
export function isRuleLike(value: any): value is RuleLike {
  try {
    createRule(value)
    return true
  }
  catch {
    return false
  }
}
