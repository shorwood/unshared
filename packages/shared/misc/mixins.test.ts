import { expect, it } from 'vitest'
import { mixins } from './mixins'

it('should mix classes into a single class', () => {
  class ClassA { foo = 'foo' }
  class ClassB { bar = 'bar' }
  class ClassC { baz = 'baz' }
  class Result extends mixins(ClassA, ClassB, ClassC) {}
  const result = new Result()
  expect(result).toHaveProperty('foo', 'foo')
  expect(result).toHaveProperty('bar', 'bar')
  expect(result).toHaveProperty('baz', 'baz')
})

it('should override properties from left to right', () => {
  class ClassA { foo = 'foo' }
  class ClassB { foo = 'bar' }
  class ClassC { foo = 'baz' }
  class Result extends mixins(ClassA, ClassB, ClassC) {}
  const result = new Result()
  expect(result).toHaveProperty('foo', 'baz')
})

it('should preserve the prototype chain', () => {
  class ClassA { foo = 'foo' }
  class ClassB { bar = 'bar' }
  class ClassC { baz = 'baz' }
  class Result extends mixins(ClassA, ClassB, ClassC) {}
  const result = new Result()
  expect(result).toBeInstanceOf(ClassA)
  expect(result).toBeInstanceOf(ClassB)
  expect(result).toBeInstanceOf(ClassC)
  expect(result).toBeInstanceOf(Result)
})

it('should preserve the `this` context', () => {
  class ClassA { foo = 'foo'; getFoo() { return this.foo } }
  class ClassB { bar = 'bar'; getBar() { return this.bar } }
  class ClassC { baz = 'baz'; getBaz() { return this.baz } }
  class Result extends mixins(ClassA, ClassB, ClassC) {}
  const result = new Result()
  expect(result.getFoo()).toBe('foo')
  expect(result.getBar()).toBe('bar')
  expect(result.getBaz()).toBe('baz')
})
