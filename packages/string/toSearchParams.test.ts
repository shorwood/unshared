/* eslint-disable unicorn/prevent-abbreviations */
import { toSearchParams } from './toSearchParams'

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

  it('should convert object with multiple array properties to query string with brackets', () => {
    const result = toSearchParams({ key: ['value1', 'value2'] }).toString()
    expect(result).toBe('key%5B%5D=value1&key%5B%5D=value2')
  })
})

describe('indices', () => {
  it('should convert object with a single array property to query string', () => {
    const result = toSearchParams({ key: ['value'] }, { arrayFormat: 'indices' }).toString()
    expect(result).toBe('key%5B0%5D=value')
  })

  it('should convert object with multiple array properties to query string', () => {
    const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { arrayFormat: 'indices' }).toString()
    expect(result).toBe('key1%5B0%5D=value1&key2%5B0%5D=value2')
  })

  it('should convert object with multiple array properties to query string with indices', () => {
    const result = toSearchParams({ key: ['value1', 'value2'] }, { arrayFormat: 'indices' }).toString()
    expect(result).toBe('key%5B0%5D=value1&key%5B1%5D=value2')
  })
})

describe('comma', () => {
  it('should convert object with a single array property to query string', () => {
    const result = toSearchParams({ key: ['value'] }, { arrayFormat: 'comma' }).toString()
    expect(result).toBe('key=value')
  })

  it('should convert object with multiple array properties to query string', () => {
    const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { arrayFormat: 'comma' }).toString()
    expect(result).toBe('key1=value1&key2=value2')
  })

  it('should convert object with multiple array properties to query string with comma', () => {
    const result = toSearchParams({ key: ['value1', 'value2'] }, { arrayFormat: 'comma' }).toString()
    expect(result).toBe('key=value1%2Cvalue2')
  })
})

describe('path', () => {
  it('should convert object with a single array property to query string', () => {
    const result = toSearchParams({ key: ['value'] }, { arrayFormat: 'path' }).toString()
    expect(result).toBe('key.0=value')
  })

  it('should convert object with multiple array properties to query string', () => {
    const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { arrayFormat: 'path' }).toString()
    expect(result).toBe('key1.0=value1&key2.0=value2')
  })

  it('should convert object with multiple array properties to query string with path', () => {
    const result = toSearchParams({ key: ['value1', 'value2'] }, { arrayFormat: 'path' }).toString()
    expect(result).toBe('key.0=value1&key.1=value2')
  })
})

describe('flat', () => {
  it('should convert object with a single array property to query string', () => {
    const result = toSearchParams({ key: ['value'] }, { arrayFormat: 'flat' }).toString()
    expect(result).toBe('key=value')
  })

  it('should convert object with multiple array properties to query string', () => {
    const result = toSearchParams({ key1: ['value1'], key2: ['value2'] }, { arrayFormat: 'flat' }).toString()
    expect(result).toBe('key1=value1&key2=value2')
  })

  it('should convert object with multiple array properties to query string with flat', () => {
    const result = toSearchParams({ key: ['value1', 'value2'] }, { arrayFormat: 'flat' }).toString()
    expect(result).toBe('key=value1&key=value2')
  })
})
