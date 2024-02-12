import { RuleLike } from './createRule'
import { isRule } from './isRule'

/** A list of rules that are executed in order until one fails. */
export type ValidationRulePipe = RuleLike[]

/**
 * Converts a rule or array of rules to a rule pipe.
 *
 * @param rules The rules to convert
 * @returns The rule pipe
 */
export function createRulePipe(rules: RuleLike | ValidationRulePipe): ValidationRulePipe {
  // --- If it's a single rule, convert it to a rule pipe.
  if (!Array.isArray(rules) && isRule(rules))
    return [rules]

  // --- If it's already a rule pipe, return it.
  if (Array.isArray(rules) && rules.every(isRule))
    return rules

  // --- Otherwise, throw an error.
  throw new TypeError('Invalid rule pipe, must be a rule or an array of rules')
}

/** v8 ignore start */
if (import.meta.vitest) {
  const rule = (value: any) => value > 0

  it('should convert a rule to a rule pipe', () => {
    const result = createRulePipe(rule)
    expect(result).toEqual([rule])
  })

  it('should convert a rule pipe to a rule pipe', () => {
    const result = createRulePipe([rule])
    expect(result).toEqual([rule])
  })

  it('should throw an error if the parameter is not a rule', () => {
    // @ts-expect-error: Testing invalid input
    const shouldThrow = () => createRulePipe(5)
    expect(shouldThrow).toThrow(TypeError)
    expect(shouldThrow).toThrow('Invalid rule pipe, must be a rule or an array of rules')
  })

  it('should throw an error if the parameter is a rule pipe with invalid rules', () => {
    const shouldThrow = () => createRulePipe([rule, 5])
    expect(shouldThrow).toThrow(TypeError)
    expect(shouldThrow).toThrow('Invalid rule pipe, must be a rule or an array of rules')
  })
}
