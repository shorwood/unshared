/** A typed constructor.  */
export type Constructor<P extends any[] = any[], R = any> = new (...parameters: P) => R

/** Extends one class with another.  */
export type Extends<T1 extends Constructor, T2 extends Constructor> =
  T1 extends Constructor<unknown[], infer R1>
    ? T2 extends Constructor<infer P, infer R2>
      ? Constructor<P, R1 & Omit<R2, keyof R1>>
      : never
    : never

/** Mixes multiple classes into a single class. */
export type Mixins<T extends Constructor[]> =
  T extends Constructor[]

    // --- If there is only two classes, then extend classes with each other.
    ? T extends [infer T1, infer T2] ? T1 extends Constructor ? T2 extends Constructor
      ? Extends<T1, T2>
      : never : never

    // --- If there is more than two classes, recursively extend the first class with the rest.
      : T extends [infer T1, ...infer TRest] ? T1 extends Constructor ? TRest extends Constructor[]
        ? Extends<T1, Mixins<TRest>>
        : never : never : never : never

/**
 * Mix multiple classes into a single class.
 *
 * **Note:** Due to a TypeScript limitation, decorators will not be inferred. It is
 * therefore necessary to manually apply them to the resulting class. Or
 * alternatively, only use mixins for classes that do not have decorators.
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html#constraints
 *
 * **Note:** Beware of the fact no privately accessible properties will be mixed.
 * Because of this, it is recommended to use the `private` keyword instead of the
 * `#` private field syntax.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
 *
 * @param mixins The classes to mix into the new class.
 * @returns The mixed class.
 * @example
 * class Foo { foo = 'foo' }
 * class Bar { bar = 'bar' }
 * class Baz { baz = 'baz' }
 * class FooBarBaz extends mixins(Foo, Bar, Baz) {}
 */
export function mixins<T extends Constructor[]>(...mixins: T): Mixins<T> {
  return class {
    constructor(...parameters: unknown[]) {
      let parentInstance: unknown
      for (const Ctor of mixins) {
        // --- Create and apply the current mixin.
        Ctor.constructor = Ctor.constructor.bind(this)
        const instance = new Ctor(...parameters)
        Object.assign(this, instance)

        // --- Preserve the prototype chain.
        Object.setPrototypeOf(
          Object.getPrototypeOf(parentInstance ?? this),
          Object.getPrototypeOf(instance),
        )

        // --- Update the parent instance.
        parentInstance = instance
      }
    }
  } as Mixins<T>
}
