/* eslint-disable unicorn/prevent-abbreviations */
import { ValidationRule } from '../types'
import { createRule } from './createRule'

/**
 * Checks if the value is a `ValidationRule`.
 * @param value The value to check
 * @returns {boolean} whether or not the value is a `ValidationRule`
 */
export const isRule = (value: any): value is ValidationRule => {
  try { createRule(value) }
  catch { return false }
  return true
}
