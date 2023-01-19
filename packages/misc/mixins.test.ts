import { expect, it } from 'vitest'
import { mixins } from './mixins'

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
  class ClassA { _foo = 'foo'; get foo() { return this._foo }; constructor() { this._foo = this.foo.toUpperCase() } }
  class ClassB { _bar = 'bar'; get bar() { return this._bar }; constructor() { this._bar = this.bar.toUpperCase() } }
  class ClassC { _baz = 'baz'; get baz() { return this._baz }; constructor() { this._baz = this.baz.toUpperCase() } }
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
  class ClassA { static FOO = 'foo' }
  class ClassB { static BAR = 'bar' }
  class ClassC { static BAZ = 'baz' }
  class Result extends mixins(ClassA, ClassB, ClassC) {}
  new Result()
  expect(Result.FOO).toEqual('foo')
  expect(Result.BAR).toEqual('bar')
  expect(Result.BAZ).toEqual('baz')
})

it('should preserve static getters and setters', () => {
  class ClassA { static FOO = 'foo'; static get foo() { return this.FOO } static set foo(value) { this.FOO = value } }
  class ClassB { static BAR = 'bar'; static get bar() { return this.BAR } static set bar(value) { this.BAR = value } }
  class ClassC { static BAZ = 'baz'; static get baz() { return this.BAZ } static set baz(value) { this.BAZ = value } }
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
  class ClassA { static getFoo() { return 'foo' }; static FOO = 'foo' }
  class ClassB { static getBar() { return 'bar' }; static BAR = 'bar' }
  class ClassC { static getBaz() { return 'baz' }; static BAZ = 'baz' }
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
