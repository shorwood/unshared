import type { Constructor, Mixins } from '@unshared/types'

/**
 * Mixes multiple classes into a single class. The resulting class will have all properties and methods
 * of the mixed classes. The resulting class will also preserve the prototype chain of the mixed classes.
 * This means that the resulting class will be an instance of all mixed classes.
 *
 * Due to a [TypeScript limitation](https://www.typescriptlang.org/docs/handbook/mixins.html#constraints),
 * decorators will not be inferred. It is therefore necessary to manually apply them to the
 * resulting class. Or alternatively, only use mixins for classes that do not have decorators.
 *
 * Beware of the fact no [privately accessible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
 * properties will be mixed. Because of this, it is recommended to use the `private` keyword instead of the
 * `#` private field syntax.
 *
 * @param mixins The classes to mix into the new class.
 * @returns The mixed class.
 * @example
 * class Foo { foo = 'foo' }
 * class Bar { bar = 'bar' }
 * class Baz { baz = 'baz' }
 * class FooBarBaz extends mixins(Foo, Bar, Baz) {}
 */
export function mixins<T extends [Constructor, ...Constructor[]]>(...mixins: T): Mixins<T> {
  if (mixins.length === 0) throw new TypeError('Cannot mix classes: no classes were passed')
  if (mixins.length === 1) return mixins[0] as Mixins<T>

  // --- Reverse the mixins to preserve the prototype chain order.
  mixins.reverse()

  // --- Create a new class extending all the mixins.
  class Mixed {
    constructor(...parameters: unknown[]) {
      const thisPrototype = Object.getPrototypeOf(this) as Record<string, unknown>
      let parentPrototype = thisPrototype

      // --- Apply the mixins.
      for (const Ctor of mixins) {
        const instance = new Ctor(...parameters)
        Object.assign(this, instance)

        // --- Preserve prototype descriptors and prototype chain.
        const instancePrototype = Object.getPrototypeOf(instance) as Record<string, unknown>
        const instanceDescriptors = Object.getOwnPropertyDescriptors(instancePrototype)
        Object.defineProperties(thisPrototype, instanceDescriptors)
        Object.setPrototypeOf(parentPrototype, instancePrototype)
        parentPrototype = instancePrototype
      }
    }
  }

  // --- Preserve static properties and return the mixed class.
  return Object.assign(Mixed, ...mixins) as Mixins<T>
}
