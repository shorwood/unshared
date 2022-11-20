import { toCamelCase } from '../string/toCamelCase'
import { getEnvironment } from './getEnvironment'

/**
 * Get variables from the environment that are prefixed with `prefix`
 * and map them to an object where the prefix is omitted and the keys are camel cased.
 * @param prefix Prefix to match variables
 * @param transformers A map of functions used to transformers the variables
 * @return Object with variables mapped to their values
 */
export function getVariables<T = Record<string, any>>(prefix: string, transformers?: Partial<{ [P in keyof T]: (value: string) => T[P] }>): Partial<T>
export function getVariables<T = Record<string, string>>(prefix: string): Partial<T>
export function getVariables(prefix: string, transformers: any = {}) {
  const environment = getEnvironment()
  const entries = Object.entries(environment)

    // --- Filter out entries that don't match the prefix.
    .filter(([key]) => key.startsWith(prefix))

    // --- Map to camel case
    .map(([key, value]) => {
      // --- Transform the key.
      key = key.replace(prefix, '')
      key = toCamelCase(key)

      // --- Transform the value.
      value = typeof transformers[key] === 'function'
        ? transformers[key](value)
        : value || transformers[key]

      // --- Return the transformed entry.
      return [key, value]
    })

  // --- Create an object from the filtered entries and return it.
  return Object.fromEntries(entries)
}
