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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return the prototype chain of a class', () => {
    class ClassA {}
    class ClassB extends ClassA {}
    class ClassC extends ClassB {}
    const classC = new ClassC()
    const result = getPrototypeChain(classC)
    expect(result).toStrictEqual([ClassC.prototype, ClassB.prototype, ClassA.prototype])
  })

  test('should omit the prototype of Object', () => {
    const result = getPrototypeChain({})
    expect(result).toStrictEqual([])
  })

  test('should return the prototype chain of null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = getPrototypeChain(null)
    expect(result).toStrictEqual([])
  })

  test('should return the prototype chain of undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = getPrototypeChain(undefined)
    expect(result).toStrictEqual([])
  })

  test('should return the prototype chain of an object', () => {
    const result = getPrototypeChain({})
    expect(result).toStrictEqual([])
  })

  test('should return the prototype chain of a number', () => {
    const result = getPrototypeChain(1)
    expect(result).toStrictEqual([Number.prototype])
  })

  test('should return the prototype chain of a string', () => {
    const result = getPrototypeChain('foo')
    expect(result).toStrictEqual([String.prototype])
  })

  test('should return the prototype chain of a boolean', () => {
    const result = getPrototypeChain(true)
    expect(result).toStrictEqual([Boolean.prototype])
  })

  test('should return the prototype chain of a symbol', () => {
    const result = getPrototypeChain(Symbol('foo'))
    expect(result).toStrictEqual([Symbol.prototype])
  })

  test('should return the prototype chain of an array', () => {
    const result = getPrototypeChain([])
    expect(result).toStrictEqual([Array.prototype])
  })

  test('should return the prototype chain of a date', () => {
    const result = getPrototypeChain(new Date())
    expect(result).toStrictEqual([Date.prototype])
  })

  test('should return the prototype chain of a regexp', () => {
    const result = getPrototypeChain(/foo/)
    expect(result).toStrictEqual([RegExp.prototype])
  })

  test('should return the prototype chain of a weakmap', () => {
    const result = getPrototypeChain(new WeakMap())
    expect(result).toStrictEqual([WeakMap.prototype])
  })

  test('should return the prototype chain of a function', () => {
    const result = getPrototypeChain(() => {})
    expect(result).toStrictEqual([Function.prototype])
  })
}
