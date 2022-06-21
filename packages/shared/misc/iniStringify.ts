/**
 * Stringify a key value pair into an INI format
 * @param {string} key The key to stringify
 * @param {any} value The value to stringify
 * @param {string} parentKey An optional parent key
 * @returns {string} The key value pair in INI format
 */
export const iniStringifyValue = (key: string, value: any, parentKey?: string): string => {
  if (Array.isArray(value)) return `${key}='${value.join(',')}'`

  if (typeof value === 'boolean') return `${key}=${value ? 'true' : 'false'}`

  if (typeof value === 'object') {
    const fullKey = [parentKey, key].filter(Boolean).join('.')
    const values: string = Object.entries(value).map(([k, v]) => iniStringifyValue(k, v, fullKey)).join('\n')
    return `[${fullKey}]\n${values}`
  }

  return `${key}=${value.toString()}`
}

/**
 * Stringify an object to an INI file.
 * @param {Record<string, any>} object The object to export
 * @returns {string} The resulting INI file contents
 * @example
 * ```ts
 * iniStringify({
 *   foo: 'bar',
 *   baz: 'qux'
 * })
 * ```
 *
 * Result:
 * ```ini
 * foo='bar'
 * baz='qux'
 * ```
 */
export const iniStringify = (object: Record<string, any>): string => {
  const result = []

  for (const [key, value] of Object.entries(object))
    result.push(iniStringifyValue(key, value))

  return result.join('\n')
}
