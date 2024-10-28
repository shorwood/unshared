/**
 * Gets the "kind" of a value. This is a more specific version of `typeof` that
 * will return the constructor name of a value if it is not a primitive type. If
 * it is a primitive type, it will return the primitive type name.
 *
 * @param value The value to check
 * @returns The type or constructor name of the value
 * @example
 * kindOf([]) // 'Array'
 * kindOf(null) // 'null'
 * kindOf(true) // 'boolean'
 * kindOf(RegExp) // 'RegExp'
 */
export function kindOf(value?: unknown): string {

  // --- If the value is an object, return the constructor name
  if (value === null) return 'null'
  if (typeof value === 'object' && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Otherwise, return the primitive type.
  return typeof value
}
