/* eslint-disable unicorn/prevent-abbreviations */
import { ValidationRule } from '@unshared-dev/types'
import { createRule } from './createRule'

/**
 * Checks if the value is a `ValidationRule`.
 * @param value The value to check
 * @return whether or not the value is a `ValidationRule`
 */
export const isRule = (value: any): value is ValidationRule => {
  try { createRule(value); return true }
  catch { return false }
}