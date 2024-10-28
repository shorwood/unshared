/* eslint-disable unicorn/prevent-abbreviations */
import type { MaybeArray } from '@unshared/types'

/** An object that can be converted to a query string. */
export type SearchParamsObject = Record<string, MaybeArray<boolean | number | string> | undefined>

/** Options for the query string conversion. */
export interface SearchParamsOptions {

  /**
   * Defines how to handle arrays in the object. There is no standard way to
   * represent arrays in query strings, so this option allows you to choose
   * how to handle them. Additionally, you can provide a custom function to
   * handle it yourself.
   *
   * - `brackets` (default): Convert arrays to `key[]=value&key[]=value` format.
   * - `indices`: Convert arrays to `key[0]=value&key[1]=value` format.
   * - `comma`: Convert arrays to `key=value1,value2` format.
   * - `path`: Convert arrays to `key.0=value&key.1=value` format.
   * - `flat`: Convert arrays to `key=value1&key=value2` format.
   *
   * @default 'brackets'
   */
  arrayFormat?: 'brackets' | 'comma' | 'flat' | 'indices' | 'path'
}

/**
 * Convert object to query string parameters. Converting all values to strings
 * and arrays to `key[0]=value&key[1]=value` format.
 *
 * @param object The object to convert to a query string.
 * @param options The query string options.
 * @returns The `URLSearchParams` object.
 */
export function toSearchParams(object: SearchParamsObject, options: SearchParamsOptions = {}): URLSearchParams {
  const { arrayFormat = 'brackets' } = options
  const search = new URLSearchParams()
  for (const key in object) {
    const value = object[key]
    if (value === undefined) continue

    // --- Convert arrays based on the format.
    if (Array.isArray(value)) {
      if (arrayFormat === 'brackets') for (const v of value) search.append(`${key}[]`, String(v))
      else if (arrayFormat === 'indices') for (const [i, v] of value.entries()) search.append(`${key}[${i}]`, String(v))
      else if (arrayFormat === 'comma') search.append(key, value.join(','))
      else if (arrayFormat === 'path') for (const [i, v] of value.entries()) search.append(`${key}.${i}`, String(v))
      else if (arrayFormat === 'flat') for (const v of value) search.append(key, String(v))
    }

    // --- Convert all values to strings.
    else { search.append(key, value.toString()) }
  }

  // --- Return the query string.
  return search
}
