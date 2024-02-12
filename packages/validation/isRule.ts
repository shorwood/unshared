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
 * isRule([isGreaterThan, 1]) // => true
 */
export function isRule(value: any): value is RuleLike {
  try {
    createRule(value)
    return true
  }
  catch {
    return false
  }
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should return true if value is a rule', () => {
    const rule = (value: any) => value > 0
    const result = isRule(rule)
    expect(result).toEqual(true)
  })

  it('should return false if value is not a rule', () => {
    const result = isRule(5)
    expect(result).toEqual(false)
  })
}
