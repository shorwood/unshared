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
  if (typeof value === 'object' && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Primitive types
  return typeof value
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should return the kind of a null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = kindOf(null)
    expect(result).toEqual('null')
  })

  it('should return the kind of an undefined', () => {
    const result = kindOf()
    expect(result).toEqual('undefined')
  })

  it('should return the kind of a boolean', () => {
    const result = kindOf(true)
    expect(result).toEqual('boolean')
  })

  it('should return the kind of a number', () => {
    const result = kindOf(1)
    expect(result).toEqual('number')
  })

  it('should return the kind of a String', () => {
    const result = kindOf('foo')
    expect(result).toEqual('string')
  })

  it('should return the kind of a Symbol', () => {
    const value = Symbol('foo')
    const result = kindOf(value)
    expect(result).toEqual('symbol')
  })

  it('should return the kind of a BigInt', () => {
    const result = kindOf(1n)
    expect(result).toEqual('bigint')
  })

  it('should return the kind of a Function', () => {
    const value = () => {}
    const result = kindOf(value)
    expect(result).toEqual('function')
  })

  it('should return the kind of an Array', () => {
    const value: unknown[] = []
    const result = kindOf(value)
    expect(result).toEqual('Array')
  })

  it('should return the kind of an Object', () => {
    const value = { foo: 'bar' }
    const result = kindOf(value)
    expect(result).toEqual('object')
  })

  it('should return the kind of a class instance', () => {
    class Foo {}
    const value = new Foo()
    const result = kindOf(value)
    expect(result).toEqual('Foo')
  })
}
