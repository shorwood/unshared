/**
 * Returns the prototype chain of an object.
 * @param target The object to get the prototype chain of.
 * @returns The prototype chain of the object.
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
