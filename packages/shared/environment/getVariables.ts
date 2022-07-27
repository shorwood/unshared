import { toCamelCase } from '../string/toCamelCase'
import { isNode } from './runtime'

export interface GetVariables {
  <T = Record<string, string>>(path: string): Partial<T>
  <T = Record<string, any>>(path: string, transformers?: Partial<{ [P in keyof T]: (value: string) => T[P] }>): Partial<T>
}

/**
 * Get variables from the environment that are prefixed with `prefix`
 * and map them to an object where the prefix is omitted and the keys are camel cased.
 * @param {string} prefix Prefix to match variables
 * @param {Function} [transformers] A map of functions used to transformers the variables
 * @returns {object} Object with variables mapped to their values
 * @TODO: Improve `transformers` parameter type in overloads
 */
export const getVariables: GetVariables = (prefix, transformers: any = {}) => {
  if (!isNode) return {}

  // --- Get the variables from the environment.
  const environmentEntries = Object.entries(process.env)
    .filter(([key, value]) => key.startsWith(prefix) && value !== undefined) as [string, string][]

  // --- Filter out entries that don't match the prefix, map to camel case, and transformers the value.
  const transformedVariablesEntries = environmentEntries
    .map(([key, value]) => {
      // --- Transform the key.
      key = toCamelCase(key.replace(prefix, ''))

      // --- Transform the value.
      value = typeof transformers[key] === 'function'
        ? transformers[key](value)
        : value || transformers[key]

      // --- Return the transformed entry.
      return [key, value]
    })

  // --- Create an object from the filtered entries and return it.
  return Object.fromEntries(transformedVariablesEntries)
}
