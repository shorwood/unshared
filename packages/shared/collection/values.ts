import { Collection, Key } from '../types'

export interface Values {
  <T, K extends Key>(object: Collection<T>, key: K): Array<T & { [P in K]: string }>
  <T>(object: Collection<T>): Array<T>
}

/**
 * Cast an object or array as an array and keep the properties' keys in its value
 * @param {Collection<T>} value The object or array to cast
 * @param {Key} [key] The key name to store the original key in the array
 * @returns {Array<T>} The array of objects
 */
export const values: Values = (value: any, key?: any): any[] => {
  // --- If value is an array, return a copy.
  if (Array.isArray(value)) return value

  // --- If no key name was provided, just return values.
  if (typeof key !== 'string' && typeof key !== 'number' && typeof key !== 'symbol')
    return Object.values(value)

  // --- Initialize result
  const result: Array<any> = []

  // --- Iterate over value's keys.
  for (const originalKey in value)
    result.push({ [key]: originalKey, ...value[originalKey] })

  // --- Return new array.
  return result
}
