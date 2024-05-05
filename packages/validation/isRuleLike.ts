import { RuleLike, createRule } from './createRule'

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

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return true if value is a rule', () => {
    const rule = (value: any) => value > 0
    const result = isRuleLike(rule)
    expect(result).toBe(true)
  })

  test('should return false if value is not a rule', () => {
    const result = isRuleLike(5)
    expect(result).toBe(false)
  })
}
