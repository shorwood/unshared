/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
import { MaybeArray } from '@unshared/types'

/** An object that can be converted to a query string. */
export type SearchParamsObject = Record<string, MaybeArray<boolean | number | string>>

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
  formatArray?: 'brackets' | 'comma' | 'flat' | 'indices' | 'path'
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
  const { formatArray = 'brackets' } = options
  const search = new URLSearchParams()

  // --- Convert all entries to query string parameters.
  for (const [key, value] of Object.entries(object)) {

    if (Array.isArray(value)) {
      if (formatArray === 'brackets') value.map(v => search.append(`${key}[]`, v.toString()))
      else if (formatArray === 'indices') value.map((v, i) => search.append(`${key}[${i}]`, v.toString()))
      else if (formatArray === 'comma') search.append(key, value.join(','))
      else if (formatArray === 'path') value.map((v, i) => search.append(`${key}.${i}`, v.toString()))
      else if (formatArray === 'flat') value.map(v => search.append(key, v.toString()))
    }

    // --- Convert all values to strings.
    else { search.append(key, value.toString()) }
  }

  // --- Return the query string.
  return search
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('toSearchParams', () => {
    it('should return an instance of URLSearchParams', () => {
      const result = toSearchParams({})
      expect(result).toBeInstanceOf(URLSearchParams)
    })

    it('should return empty string for empty object', () => {
      const result = toSearchParams({}).toString()
      expect(result).toBe('')
    })

    it('should convert object with a single string property to query string', () => {
      const result = toSearchParams({ key: 'value' }).toString()
      expect(result).toBe('key=value')
    })

    it('should convert object with a single number property to query string', () => {
      const result = toSearchParams({ key: 1 }).toString()
      expect(result).toBe('key=1')
    })

    it('should convert object with a single boolean property to query string', () => {
      const result = toSearchParams({ key: true }).toString()
      expect(result).toBe('key=true')
    })

    it('should convert object with multiple properties to query string', () => {
      const result = toSearchParams({ key1: 'value1', key2: 'value2' }).toString()
      expect(result).toBe('key1=value1&key2=value2')
    })
  })

  describe('brackets', () => {
    it('should convert object with a single array property to query string', () => {
      const result = toSearchParams({ key: ['value'] }).toString()
      expect(result).toBe('key%5B%5D=value')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }).toString()
      expect(result).toBe('key1%5B%5D=value1&key2%5B%5D=value2')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key: ['value1', 'value2'] }).toString()
      expect(result).toBe('key%5B%5D=value1&key%5B%5D=value2')
    })
  })

  describe('indices', () => {
    it('should convert object with a single array property to query string', () => {
      const result = toSearchParams({ key: ['value'] }, { formatArray: 'indices' }).toString()
      expect(result).toBe('key%5B0%5D=value')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { formatArray: 'indices' }).toString()
      expect(result).toBe('key1%5B0%5D=value1&key2%5B0%5D=value2')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key: ['value1', 'value2'] }, { formatArray: 'indices' }).toString()
      expect(result).toBe('key%5B0%5D=value1&key%5B1%5D=value2')
    })
  })

  describe('comma', () => {
    it('should convert object with a single array property to query string', () => {
      const result = toSearchParams({ key: ['value'] }, { formatArray: 'comma' }).toString()
      expect(result).toBe('key=value')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { formatArray: 'comma' }).toString()
      expect(result).toBe('key1=value1&key2=value2')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key: ['value1', 'value2'] }, { formatArray: 'comma' }).toString()
      expect(result).toBe('key=value1%2Cvalue2')
    })
  })

  describe('path', () => {
    it('should convert object with a single array property to query string', () => {
      const result = toSearchParams({ key: ['value'] }, { formatArray: 'path' }).toString()
      expect(result).toBe('key.0=value')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { formatArray: 'path' }).toString()
      expect(result).toBe('key1.0=value1&key2.0=value2')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key: ['value1', 'value2'] }, { formatArray: 'path' }).toString()
      expect(result).toBe('key.0=value1&key.1=value2')
    })
  })

  describe('flat', () => {
    it('should convert object with a single array property to query string', () => {
      const result = toSearchParams({ key: ['value'] }, { formatArray: 'flat' }).toString()
      expect(result).toBe('key=value')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { formatArray: 'flat' }).toString()
      expect(result).toBe('key1=value1&key2=value2')
    })

    it('should convert object with multiple array properties to query string', () => {
      const result = toSearchParams({ key: ['value1', 'value2'] }, { formatArray: 'flat' }).toString()
      expect(result).toBe('key=value1&key=value2')
    })
  })
}
