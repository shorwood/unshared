import type { Immutable } from '@unshared/types'

/**
 * Returns a deeply immutable proxy of the given object. This means that all
 * nested properties are readonly, and cannot be changed. The original object
 * can still be mutated and will be reflected in the immutable proxy.
 *
 * @param object The object to make immutable.
 * @returns An immutable object.
 * @example
 * const object = { a: 1, b: { c: 2 } }
 * const immutableObject = immutable(object)
 * immutableObject.a = 2 // Error
 */
export function immutable<T extends object>(object: T): Immutable<T> {
  return new Proxy(object, {
    deleteProperty() {
      return false
    },
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver) as unknown
      return typeof value === 'object' && value !== null
        ? immutable(value)
        : value
    },
    set() {
      return false
    },
  }) as Immutable<T>
}
