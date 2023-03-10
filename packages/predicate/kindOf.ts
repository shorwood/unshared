/**
 * Gets the type of a value. If the value is an object, it will return the constructor name.
 *
 * @param value The value to check
 * @returns The type or constructor name of the value
 * @example
 * getType([]) // 'Array'
 * getType(null) // 'null'
 * getType(true) // 'boolean'
 * getType(RegExp) // 'RegExp'
 */
export const kindOf = (value?: any): string => {
  // --- Is null
  if (value === null) return 'null'

  // --- Primitive types
  const typeOf = typeof value
  if (typeOf !== 'object') return typeOf

  // --- Value is an array
  if (Array.isArray(value)) return 'Array'

  // --- Get the constructor name
  if ('constructor' in value && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Default to object
  return 'object'
}
