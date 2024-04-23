/**
 * Returns the prototype chain of an object. The prototype chain is an array of
 * constructors that are used to construct the object. For example, if an the
 * class `Baz` extends the class `Bar`, which extends the class `Foo`, the
 * prototype chain of an instance of `Baz` will be `[Bar.prototype, Foo.prototype, Object.prototype]`.
 *
 * @param target The object to get the prototype chain of.
 * @returns The prototype chain of the object.
 * @example
 * // Create a class hierarchy.
 * class Foo {}
 * class Bar extends Foo {}
 * class Baz extends Bar {}
 *
 * // Get the prototype chain of an instance of `Baz`.
 * getPrototypeChain(new Baz()) // [Bar.prototype, Foo.prototype, Object.prototype]
 */
export function getPrototypeChain(target: unknown): unknown[] {
  if (target === null || target === undefined) return []
  let targetPrototype = Object.getPrototypeOf(target) as object
  const result = []

  // --- Traverse the prototype chain and add each prototype to the result.
  while (targetPrototype instanceof Object) {
    result.push(targetPrototype)
    targetPrototype = Object.getPrototypeOf(targetPrototype) as object
  }

  // --- Return the prototype chain
  return result
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the prototype chain of a class', () => {
    class ClassA {}
    class ClassB extends ClassA {}
    class ClassC extends ClassB {}
    const classC = new ClassC()
    const result = getPrototypeChain(classC)
    expect(result).toEqual([ClassB.prototype, ClassA.prototype, Object.prototype])
  })

  it('should omit the prototype of Object', () => {
    const result = getPrototypeChain({})
    expect(result).toEqual([])
  })

  it('should return the prototype chain of null', () => {
    const result = getPrototypeChain(null)
    expect(result).toEqual([])
  })

  it('should return the prototype chain of undefined', () => {
    const result = getPrototypeChain()
    expect(result).toEqual([])
  })

  it('should return the prototype chain of an object', () => {
    const result = getPrototypeChain({})
    expect(result).toEqual([])
  })

  it('should return the prototype chain of a number', () => {
    const result = getPrototypeChain(1)
    expect(result).toEqual([Number.prototype])
  })

  it('should return the prototype chain of a string', () => {
    const result = getPrototypeChain('foo')
    expect(result).toEqual([String.prototype])
  })

  it('should return the prototype chain of a boolean', () => {
    const result = getPrototypeChain(true)
    expect(result).toEqual([Boolean.prototype])
  })

  it('should return the prototype chain of a symbol', () => {
    const result = getPrototypeChain(Symbol('foo'))
    expect(result).toEqual([Symbol.prototype])
  })

  it('should return the prototype chain of an array', () => {
    const result = getPrototypeChain([])
    expect(result).toEqual([Array.prototype])
  })

  it('should return the prototype chain of a date', () => {
    const result = getPrototypeChain(new Date())
    expect(result).toEqual([Date.prototype])
  })

  it('should return the prototype chain of a regexp', () => {
    const result = getPrototypeChain(/foo/)
    expect(result).toEqual([RegExp.prototype])
  })

  it('should return the prototype chain of a weakmap', () => {
    const result = getPrototypeChain(new WeakMap())
    expect(result).toEqual([WeakMap.prototype])
  })

  it('should return the prototype chain of a function', () => {
    const result = getPrototypeChain(() => {})
    expect(result).toEqual([Function.prototype])
  })
}
