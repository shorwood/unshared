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
export function kindOf(value?: any): string {
  // --- Is null
  if (value === null) return 'null'

  // --- Get the constructor name
  if ('constructor' in value && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Primitive types
  const typeOf = typeof value
  if (typeOf !== 'object') return typeOf

  // --- Default to object
  return 'object'
}
