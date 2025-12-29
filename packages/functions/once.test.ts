import { randomInt } from 'node:crypto'
import { once, Once } from './once'

describe('once', () => {
  describe('once', () => {
    test('should only call the function once', () => {
      const fn = vi.fn()
      const wrapped = once(fn)
      wrapped()
      wrapped()
      wrapped()
      expect(fn).toHaveBeenCalledOnce()
    })

    test('should always return the same result', () => {
      const wrapped = once(Math.random)
      const resultFirst = wrapped()
      const resultSecond = wrapped()
      const resultThird = wrapped()
      expect(resultFirst).toStrictEqual(resultSecond)
      expect(resultSecond).toStrictEqual(resultThird)
      expectTypeOf(wrapped).toEqualTypeOf<(() => number) & { reset: () => void }>()
    })

    test('should take parameters but ignore them after the first call', () => {
      const fn = vi.fn((n: number) => n)
      const wrapped = once(fn)
      const resultFirst = wrapped(1)
      const resultSecond = wrapped(2)
      const resultThird = wrapped(3)
      expect(resultFirst).toBe(1)
      expect(resultSecond).toBe(1)
      expect(resultThird).toBe(1)
      expect(fn).toHaveBeenCalledExactlyOnceWith(1)
    })

    test('should call the function again after reset', () => {
      const fn = vi.fn()
      const wrapped = once(fn)
      wrapped()
      wrapped.reset()
      wrapped()
      expect(fn).toHaveBeenCalledTimes(2)
    })

    test('should preserve the `this` context when calling the function', () => {
      const context = { value: 42 }
      const fn = vi.fn(function(this: typeof context) {
        return this.value
      })
      const wrapped = once(fn)
      const result = wrapped.call(context)
      expect(result).toBe(42)
    })

    test('should return different results for different `this` contexts', () => {
      const wrapped = once(Math.random)
      const result1 = wrapped.call({})
      const result2 = wrapped.call({})
      expect(result1).not.toStrictEqual(result2)
    })
  })

  describe('Once', () => {
    test('should return the same value if no arguments are passed', () => {
      const fn = vi.fn(Math.random)
      class MyClass { @Once() getId() { return fn() } }
      const instance = new MyClass()
      const id1 = instance.getId()
      const id2 = instance.getId()
      expect(id1).toStrictEqual(id2)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith()
    })

    test('should return the same values if different arguments are passed', () => {
      const fn = vi.fn((n = 0) => (n as number) + randomInt(0, 1e6))
      class MyClass { @Once() getId(n: number) { return fn(n) } }
      const instance = new MyClass()
      const id1 = instance.getId(1)
      const id2 = instance.getId(1)
      const id3 = instance.getId(2)
      expect(id1).toStrictEqual(id2)
      expect(id1).toStrictEqual(id3)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(1)
      expect(fn).not.toHaveBeenCalledWith(2)
    })

    test('should preserve the method context', () => {
      class MyClass { value = { foo: 42 }; @Once() getValue() { return this?.value } }
      const instance = new MyClass()
      const result1 = instance.getValue()
      const result2 = instance.value
      expect(result1).toBe(result2)
    })

    test('should have different results for different instances', () => {
      class MyClass { @Once() getValue() { return randomInt(0, 1e6) } }
      const instance1 = new MyClass()
      const instance2 = new MyClass()
      const result1 = instance1.getValue()
      const result2 = instance2.getValue()
      expect(result1).not.toStrictEqual(result2)
    })

    test('should throw a TypeError when applied to a class field', () => {
      const shouldThrow = () => {
        // @ts-expect-error: Decorator should not be applied to class fields
        class MyClass { @Once() fn = () => {} }
        return new MyClass()
      }
      expect(shouldThrow).toThrow(TypeError)
    })

    test('should throw a TypeError when applied to an accessor', () => {
      const shouldThrow = () => {
        class MyClass {
          // @ts-expect-error: Decorator should not be applied to accessors
          @Once() accessor value = 'foo'
        }
        return new MyClass()
      }
      expect(shouldThrow).toThrow(TypeError)
    })
  })
})
