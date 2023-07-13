/* eslint-disable unicorn/no-null */
/**
 * Returns the prototype chain of an object.
 *
 * @param  target The object to get the prototype chain of.
 * @returns The prototype chain of the object.
 * @example
 * class Foo {}
 * class Bar extends Foo {}
 * class Baz extends Bar {}
 * const c = new Baz()
 * getPrototypeChain(c) // [Bar.prototype, Foo.prototype, Object.prototype]
 */
export function getPrototypeChain(target: unknown): unknown[] {
  if (target === null || target === undefined) return []
  let targetPrototype = Object.getPrototypeOf(target)
  const result = []

  // --- Traverse the prototype chain
  while (targetPrototype instanceof Object) {
    result.push(targetPrototype)
    targetPrototype = Object.getPrototypeOf(targetPrototype)
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

  it.each([
    ['null', null, []],
    ['undefined', undefined, []],
    ['an object', {}, []],
    ['a number', 1, [Number.prototype]],
    ['a string', 'foo', [String.prototype]],
    ['a boolean', true, [Boolean.prototype]],
    ['a symbol', Symbol('foo'), [Symbol.prototype]],
    ['an array', [], [Array.prototype]],
    ['a date', new Date(), [Date.prototype]],
    ['a regexp', /foo/, [RegExp.prototype]],
    ['a weakmap', new WeakMap(), [WeakMap.prototype]],
    ['a weakset', new WeakSet(), [WeakSet.prototype]],
  ])('should return the prototype chain of %s', (_, value, expected) => {
    const result = getPrototypeChain(value)
    expect(result).toEqual(expected)
  })
}
