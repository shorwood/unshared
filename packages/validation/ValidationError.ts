import { ValidationRule } from './types'

/**
 * Class that represents a validation error. It is used to store the result of a validation.
 */
export class ValidationError extends Error {
  /**
   * Create a new `ValidationError` instance.
   *
   * @param ruleObject
   */

  /**
   * The name of the error.
   */
  name = 'ValidationError'
  /**
   * The value that failed the validation.
   */
  value: unknown
  /**
   * The rule that failed the validation.
   *
   * @see ValidationRule
   */
  rule: ValidationRule
  /**
   * The parameters of the rule that failed the validation.
   *
   * @see ValidationRule
   */
  parameters: unknown[]
  /**
   * The error that was thrown by the rule that failed the validation.
   */
  cause?: Error
}
