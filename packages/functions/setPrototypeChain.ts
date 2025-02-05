/**
 * Sets the prototype chain of an object.
 *
 * @param target The object to set the prototype chain of.
 * @param sources The prototype chain to set.
 * @returns The object with the new prototype chain.
 * @example
 * // Create multiple classes.
 * class ClassA {}
 * class ClassB {}
 * class ClassC {}
 *
 * // Set the prototype chain of `classC` to `classB` and `classA`.
 * setPrototypeChain(classC, classB, classA)
 *
 * // Check the prototype chain of `classC`.
 * classC instanceof ClassA // => true
 */
export function setPrototypeChain<T>(target: T, ...sources: any[]): T {
  let instance = target

  // --- Set the prototype chain
  for (const source of sources) {
    instance = Object.setPrototypeOf(
      Object.getPrototypeOf(instance) as object,
      Object.getPrototypeOf(source) as object,
    ) as T
  }

  // --- Return the object with the new prototype chain
  return target
}
