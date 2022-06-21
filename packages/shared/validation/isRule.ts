/* eslint-disable unicorn/prevent-abbreviations */
import { ValidationRule } from './types'

/**
 * Checks if the value is a `ValidationRule`.
 * @param value The value to check
 * @returns {boolean} whether or not the value is a `ValidationRule`
 */
export const isRule = (value: any): value is ValidationRule => {
  // --- Is rule as function
  if (typeof value === 'function') return true

  // --- is rule as array
  if (Array.isArray(value)) {
    const [handler, args, errorMessage] = value
    if (value.length < 2) return false
    if (value.length > 3) return false
    if (typeof handler !== 'function') return false
    if (args && typeof args === 'function') return false
    if (errorMessage && (typeof errorMessage !== 'function' && typeof errorMessage !== 'string')) return false
    if (value.every(isRule)) return false
    return true
  }

  // --- is rule as object
  if (value && typeof value === 'object') {
    const { handler, name, errorMessage } = value
    if (typeof handler !== 'function') return false
    if (name && typeof name !== 'string') return false
    if (errorMessage && (typeof errorMessage !== 'function' && typeof errorMessage !== 'string')) return false
    return true
  }

  // --- Is indeed a rule
  return false
}
