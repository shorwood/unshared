import { Mixins } from '@unshared/types/Mixins'
import { Constructor } from '@unshared/types/Constructor'

/**
 * Mix multiple classes into a single class.
 *
 * **Note:** Due to a TypeScript limitation, decorators will not be inferred. It is
 * therefore necessary to manually apply them to the resulting class. Or
 * alternatively, only use mixins for classes that do not have decorators.
 *
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html#constraints
 *
 * **Note:** Beware of the fact no privately accessible properties will be mixed.
 * Because of this, it is recommended to use the `private` keyword instead of the
 * `#` private field syntax.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
 * @param mixins The classes to mix into the new class.
 * @returns The mixed class.
 * @example
 * class Foo { foo = 'foo' }
 * class Bar { bar = 'bar' }
 * class Baz { baz = 'baz' }
 * class FooBarBaz extends mixins(Foo, Bar, Baz) {}
 */
export function mixins<T extends [Constructor, ...Constructor[]]>(...mixins: T): Mixins<T> {
  // --- Handle the edge cases.
  if (mixins.length === 0) throw new TypeError('No mixins were provided.')
  if (mixins.some(mixin => typeof mixin !== 'function')) throw new TypeError('All mixins must be class constructors.')
  if (mixins.length === 1) return mixins[0] as Mixins<T>

  // --- Reverse the mixins to preserve the prototype chain.
  mixins.reverse()

  // --- Create a new class extending all the mixins.
  class Mixed {
    constructor(...parameters: unknown[]) {
      const thisPrototype = Object.getPrototypeOf(this)
      let parentPrototype = thisPrototype

      // --- Apply the mixins.
      for (const Ctor of mixins) {
        const instance = new Ctor(...parameters)
        Object.assign(this, instance)

        // --- Preserve prototype descriptors and prototype chain.
        const instancePrototype = Object.getPrototypeOf(instance)
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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should mix classes into a single class', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toHaveProperty('bar', 'bar')
    expect(result).toHaveProperty('baz', 'baz')
  })

  it('should override properties from right to left', () => {
    class ClassA { foo = 'foo' }
    class ClassB { foo = 'bar' }
    class ClassC { foo = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
  })

  it('should preserve the prototype chain', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    const result = new Result()
    expect(result).toBeInstanceOf(Result)
    expect(result).toBeInstanceOf(ClassC)
    expect(result).toBeInstanceOf(ClassB)
    expect(result).toBeInstanceOf(ClassA)
  })

  it('should preserve the prototype chain of nested mixins', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toBeInstanceOf(Result)
    expect(result).toBeInstanceOf(ClassC)
    expect(result).toBeInstanceOf(ClassB)
    expect(result).toBeInstanceOf(ClassA)
  })

  it('should preserve the `this` context', () => {
    class ClassA { _foo = 'foo'; get foo() { return this._foo } constructor() { this._foo = this.foo.toUpperCase() } }
    class ClassB { _bar = 'bar'; get bar() { return this._bar } constructor() { this._bar = this.bar.toUpperCase() } }
    class ClassC { _baz = 'baz'; get baz() { return this._baz } constructor() { this._baz = this.baz.toUpperCase() } }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {
      fooBarBaz = ''
      constructor() {
        super()
        this.fooBarBaz = this.foo + this.bar + this.baz
      }
    }
    const result = new Result()
    expect(result).toHaveProperty('foo', 'FOO')
    expect(result).toHaveProperty('bar', 'BAR')
    expect(result).toHaveProperty('baz', 'BAZ')
    expect(result).toHaveProperty('fooBarBaz', 'FOOBARBAZ')
  })

  it('should preserve private properties', () => {
    class ClassA { private foo = 'foo' }
    class ClassB { private bar = 'bar' }
    class ClassC { private baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toHaveProperty('bar', 'bar')
    expect(result).toHaveProperty('baz', 'baz')
  })

  it('should just return the class if only one class is passed', () => {
    class ClassA { foo = 'foo' }
    class Result extends mixins(ClassA) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toBeInstanceOf(ClassA)
  })

  it('should preserve getters and setters', () => {
    class ClassA { _foo = 'foo'; get foo() { return this._foo } set foo(value) { this._foo = value } }
    class ClassB { _bar = 'bar'; get bar() { return this._bar } set bar(value) { this._bar = value } }
    class ClassC { _baz = 'baz'; get baz() { return this._baz } set baz(value) { this._baz = value } }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    const result = new Result()
    result.foo = 'FOO'
    result.bar = 'BAR'
    result.baz = 'BAZ'
    expect(result.foo).toEqual('FOO')
    expect(result.bar).toEqual('BAR')
    expect(result.baz).toEqual('BAZ')
  })

  it('should preserve static properties', () => {
    const ClassA = { FOO: 'foo' }
    const ClassB = { BAR: 'bar' }
    const ClassC = { BAZ: 'baz' }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    new Result()
    expect(Result.FOO).toEqual('foo')
    expect(Result.BAR).toEqual('bar')
    expect(Result.BAZ).toEqual('baz')
  })

  it('should preserve static getters and setters', () => {
    const ClassA = { FOO: 'foo', get foo() { return this.FOO }, set foo(value) { this.FOO = value } }
    const ClassB = { BAR: 'bar', get bar() { return this.BAR }, set bar(value) { this.BAR = value } }
    const ClassC = { BAZ: 'baz', get baz() { return this.BAZ }, set baz(value) { this.BAZ = value } }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    new Result()
    Result.foo = 'FOO'
    Result.bar = 'BAR'
    Result.baz = 'BAZ'
    expect(Result.foo).toEqual('FOO')
    expect(Result.bar).toEqual('BAR')
    expect(Result.baz).toEqual('BAZ')
  })

  it('should preserve statics when nesting mixins', () => {
    const ClassA = { getFoo() { return 'foo' }, FOO: 'foo' }
    const ClassB = { getBar() { return 'bar' }, BAR: 'bar' }
    const ClassC = { getBaz() { return 'baz' }, BAZ: 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    new Result()
    expect(Result).toHaveProperty('FOO', 'foo')
    expect(Result).toHaveProperty('BAR', 'bar')
    expect(Result).toHaveProperty('BAZ', 'baz')
  })

  it('should throw if no class is passed', () => {
    // @ts-expect-error: invalid arguments
    const shouldThrow = () => mixins()
    expect(shouldThrow).toThrow()
  })

  it('should throw if a non-class is passed', () => {
    // @ts-expect-error: invalid arguments
    const shouldThrow = () => mixins('foo')
    expect(shouldThrow).toThrow()
  })
}
