/**
 * Gets the type of a value. If the value is an object, it will return the constructor name.
 * @param {any} value The value to check
 * @returns {string} The type or constructor name of the value
 * @example
 * getType([]) // 'array'
 * getType(null) // 'null'
 * getType(true) // 'boolean'
 * getType(RegExp) // 'RegExp'
 */
export const kindOf = (value?: any): string => {
  // --- Is null
  if (value === null) return 'null'

  // --- Primitive types
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'bigint') return 'bigint'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'symbol') return 'symbol'
  if (typeof value === 'function') return 'function'

  // --- Value is an array
  if (Array.isArray(value)) return 'array'

  // --- Get the constructor name
  if ('constructor' in value && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Default to object
  return 'object'
}
