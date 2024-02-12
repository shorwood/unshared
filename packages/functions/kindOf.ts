
/**
 * Gets the "kind" of a value. This is a more specific version of `typeof` that
 * will return the constructor name of a value if it is not a primitive type. If
 * it is a primitive type, it will return the primitive type name.
 *
 * @param value The value to check
 * @returns The type or constructor name of the value
 * @example
 * getType([]) // 'Array'
 * getType(null) // 'null'
 * getType(true) // 'Boolean'
 * getType(RegExp) // 'RegExp'
 */
export function kindOf(value?: unknown): string {
  // --- Is null
  if (value === null) return 'null'

  // --- Get the constructor name
  if (typeof value === 'object' && 'constructor' in value && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Primitive types
  const typeOf = typeof value
  if (typeOf !== 'object') return typeOf

  // --- Default to object
  return 'object'
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the kind of a Boolean', () => {
    const result = kindOf(true)
    expect(result).toEqual('Boolean')
  })

  it('should return the kind of a Number', () => {
    const result = kindOf(1)
    expect(result).toEqual('Number')
  })

  it('should return the kind of a String', () => {
    const result = kindOf('foo')
    expect(result).toEqual('String')
  })

  it('should return the kind of a Symbol', () => {
    const value = Symbol('foo')
    const result = kindOf(value)
    expect(result).toEqual('Symbol')
  })

  it('should return the kind of a BigInt', () => {
    const result = kindOf(1n)
    expect(result).toEqual('BigInt')
  })
}
