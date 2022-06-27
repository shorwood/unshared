import { Key } from '../types'

export interface Values {
  <T>(object: Array<T>): Array<T>
  <T extends Record<string, any>>(object: Record<string, T>): Array<T>
  <T extends Record<string, any>, K extends string>(object: Record<string, T>, key: K): Array<T & { [P in K]: string }>
}

/**
 * Cast an object or array as an array and keep the properties' keys in its value
 * @param {Record<string, T>} value The object or array to cast
 * @param {string | number | symbol} key The key name to store the original key in the array
 * @returns {Array<T>} The array of objects
 */
export const values: Values = (value: Array<any> | Record<string, Record<string, any>>, key?: Key): any[] => {
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
