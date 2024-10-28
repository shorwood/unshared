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
