/* eslint-disable @typescript-eslint/no-empty-object-type */
import { mixins } from './mixins'

describe('mixins', () => {
  test('should mix classes into a single class', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toHaveProperty('bar', 'bar')
    expect(result).toHaveProperty('baz', 'baz')
    expectTypeOf(result).toEqualTypeOf<{
      bar: string
      baz: string
      foo: string
    }>()
  })

  test('should override properties from right to left', () => {
    class ClassA { foo = 'foo' }
    class ClassB { foo = 'bar' }
    class ClassC { foo = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  test('should preserve the prototype chain', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    const result = new Result()
    expect(result).toBeInstanceOf(Result)
    expect(result).toBeInstanceOf(ClassC)
    expect(result).toBeInstanceOf(ClassB)
    expect(result).toBeInstanceOf(ClassA)
    expectTypeOf(result).toEqualTypeOf<{
      bar: string
      baz: string
      foo: string
    }>()
  })

  test('should preserve the prototype chain of nested mixins', () => {
    class ClassA { foo = 'foo' }
    class ClassB { bar = 'bar' }
    class ClassC { baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toBeInstanceOf(Result)
    expect(result).toBeInstanceOf(ClassC)
    expect(result).toBeInstanceOf(ClassB)
    expect(result).toBeInstanceOf(ClassA)
    expectTypeOf(result).toEqualTypeOf<{
      bar: string
      baz: string
      foo: string
    }>()
  })

  test('should preserve the `this` context', () => {
    class ClassA { _foo = 'foo'; constructor() { this._foo = this.foo.toUpperCase() } get foo() { return this._foo } }
    class ClassB { _bar = 'bar'; constructor() { this._bar = this.bar.toUpperCase() } get bar() { return this._bar } }
    class ClassC { _baz = 'baz'; constructor() { this._baz = this.baz.toUpperCase() } get baz() { return this._baz } }
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
    expectTypeOf(result).toEqualTypeOf<{
      _bar: string
      _baz: string
      _foo: string
      bar: string
      baz: string
      foo: string
      fooBarBaz: string
    }>()
  })

  test('should preserve private properties', () => {
    class ClassA { private foo = 'foo' }
    class ClassB { private bar = 'bar' }
    class ClassC { private baz = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toHaveProperty('bar', 'bar')
    expect(result).toHaveProperty('baz', 'baz')
    expectTypeOf(result).toEqualTypeOf<{}>()
  })

  test('should just return the class if only one class is passed', () => {
    class ClassA { foo = 'foo' }
    class Result extends mixins(ClassA) {}
    const result = new Result()
    expect(result).toHaveProperty('foo', 'foo')
    expect(result).toBeInstanceOf(ClassA)
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>()
  })

  test('should preserve getters and setters', () => {
    class ClassA { _foo = 'foo'; get foo() { return this._foo } set foo(value) { this._foo = value } }
    class ClassB { _bar = 'bar'; get bar() { return this._bar } set bar(value) { this._bar = value } }
    class ClassC { _baz = 'baz'; get baz() { return this._baz } set baz(value) { this._baz = value } }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    const result = new Result()
    result.foo = 'FOO'
    result.bar = 'BAR'
    result.baz = 'BAZ'
    expect(result.foo).toBe('FOO')
    expect(result.bar).toBe('BAR')
    expect(result.baz).toBe('BAZ')
    expectTypeOf(result).toEqualTypeOf<{
      _bar: string
      _baz: string
      _foo: string
      bar: string
      baz: string
      foo: string
    }>()
  })

  test('should preserve static properties', () => {
    class ClassA { static FOO = 'foo' }
    class ClassB { static BAR = 'bar' }
    class ClassC { static BAZ = 'baz' }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    expect(Result.FOO).toBe('foo')
    expect(Result.BAR).toBe('bar')
    expect(Result.BAZ).toBe('baz')

  })

  test('should preserve static getters and setters', () => {
    class ClassA { static FOO = 'foo'; static get foo() { return this.FOO } static set foo(value) { this.FOO = value } }
    class ClassB { static BAR = 'bar'; static get bar() { return this.BAR } static set bar(value) { this.BAR = value } }
    class ClassC { static BAZ = 'baz'; static get baz() { return this.BAZ } static set baz(value) { this.BAZ = value } }
    class Result extends mixins(ClassA, ClassB, ClassC) {}
    Result.foo = 'FOO'
    Result.bar = 'BAR'
    Result.baz = 'BAZ'
    expect(Result.foo).toBe('FOO')
    expect(Result.bar).toBe('BAR')
    expect(Result.baz).toBe('BAZ')
  })

  test('should preserve statics when nesting mixins', () => {
    class ClassA { static FOO = 'foo' }
    class ClassB { static BAR = 'bar' }
    class ClassC { static BAZ = 'baz' }
    class Result extends mixins(mixins(ClassA, ClassB), ClassC) {}
    expect(Result).toHaveProperty('FOO', 'foo')
    expect(Result).toHaveProperty('BAR', 'bar')
    expect(Result).toHaveProperty('BAZ', 'baz')
  })

  test('should throw if no class is passed', () => {
    // @ts-expect-error: invalid arguments
    const shouldThrow = () => mixins()
    expect(shouldThrow).toThrow('Cannot mix classes: no classes were passed')
  })
})
