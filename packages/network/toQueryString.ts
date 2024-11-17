import type { MaybeArray } from '@unshared/types'

/**
 * Convert object to query string parameters. Converting all values to strings
 * and arrays to `key[0]=value&key[1]=value` format.
 *
 * @param object The object to convert to a query string.
 * @returns The query string.
 */
export function toQueryString(object: Record<string, MaybeArray<boolean | number | string>>): string {
  const search = new URLSearchParams()

  // --- Convert all entries to query string parameters.
  for (const [key, value] of Object.entries(object)) {

    if (Array.isArray(value)) {
      for (const [i, v] of value.entries())
        search.append(`${key}[${i}]`, v.toString())
    }

    // --- Convert all values to strings.
    else { search.append(key, value.toString()) }
  }

  // --- Return the query string.
  return search.toString()
}
