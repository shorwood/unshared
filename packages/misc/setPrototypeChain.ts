/**
 * Sets the prototype chain of an object.
 * @param target The object to set the prototype chain of.
 * @param sources The prototype chain to set.
 * @returns The object with the new prototype chain.
 */
export function setPrototypeChain<T>(target: T, ...sources: object[]): T {
  let instance = target

  // --- Set the prototype chain
  for (const source of sources)
    instance = Object.setPrototypeOf(
      Object.getPrototypeOf(instance),
      Object.getPrototypeOf(source),
    )

  // --- Return the object with the new prototype chain
  return target
}
