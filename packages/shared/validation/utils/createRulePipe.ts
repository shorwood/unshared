import { ValidationRule, ValidationRulePipe } from '../types'
import { isRule } from './isRule'

/**
 * Converts a rule or array of rules to a rule pipe.
 * @param rules The rules to convert
 * @returns The rule pipe
 */
export const createRulePipe = (rules: ValidationRule | ValidationRulePipe): ValidationRulePipe => {
  // --- If it's a single rule, wrap it in an array
  // @ts-expect-error: ignore
  if (!Array.isArray(rules) || !rules.every(isRule)) return [rules]

  // --- If not, it's already a rule pipe
  // @ts-expect-error: ignore
  return rules
}
