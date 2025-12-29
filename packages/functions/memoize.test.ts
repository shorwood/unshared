import { randomInt } from 'node:crypto'
import { memoize, Memoize } from './memoize'

describe('memoize', () => {
  describe('memoize', () => {
    beforeAll(() => {
      vi.useFakeTimers()
    })

    it('should call the function with the given parameters', () => {
      const fn = vi.fn()
      const memoized = memoize(fn)
      memoized(1)
      expect(fn).toHaveBeenCalledWith(1)
    })

    it('should return the result of the function', () => {
      const memoized = memoize((value: number) => value)
      const result = memoized(10)
      expect(result).toBe(10)
    })

    it('should return the cached result if the parameters are the same', () => {
      const fn = vi.fn((n: number) => n)
      const memoized = memoize(fn)
      memoized(1)
      memoized(1)
      memoized(1)
      expect(fn).toHaveBeenCalledWith(1)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(memoized.cache.size).toBe(1)
    })

    it('should return a different result if the parameters are different', () => {
      const fn = vi.fn((n: number) => n)
      const memoized = memoize(fn)
      memoized(1)
      memoized(2)
      memoized(3)
      expect(fn).toHaveBeenCalledWith(1)
      expect(fn).toHaveBeenCalledWith(2)
      expect(fn).toHaveBeenCalledWith(3)
      expect(fn).toHaveBeenCalledTimes(3)
      expect(memoized.cache.size).toBe(3)
    })

    it('should register the parameters and the result in the cache', () => {
      const memoized = memoize((value: number) => value)
      memoized(1)
      const result = [...memoized.cache.entries()]
      expect(result).toStrictEqual([['[1]', 1]])
    })

    it('should use the custom cache provided in the options', () => {
      const cache = new Map<string, unknown>()
      const memoized = memoize((value: number) => value, { cache })
      expect(memoized.cache).toBe(cache)
    })

    it('should use the custom key generator provided in the options', () => {
      const getKey = vi.fn((n: number) => Math.floor(n).toString())
      const fn = vi.fn((n: number) => n)
      const memoized = memoize(fn, { getKey })
      memoized(1.25)
      memoized(1.75)
      expect(getKey).toHaveBeenCalledWith(1.25)
      expect(getKey).toHaveBeenCalledWith(1.75)
      expect(getKey).toHaveBeenCalledTimes(2)
      expect(memoized.cache.size).toBe(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should preserve the `this` context of the function', () => {
      const context = { value: 42 }
      const memoized = memoize(function(this: typeof context) { return this.value })
      const result = memoized.call(context)
      expect(result).toBe(42)
    })
  })

  describe('Memoize', () => {
    it('should memoize the method', () => {
      const fn = vi.fn(() => randomInt(0, 1e6))
      class MyClass { @Memoize() getId() { return fn() } }
      const instance = new MyClass()
      const id1 = instance.getId()
      const id2 = instance.getId()
      expect(id1).toStrictEqual(id2)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith()
    })

    it('should memoize the method by parameter', () => {
      const fn = vi.fn((n = 0) => (n as number) + randomInt(0, 1e6))
      class MyClass { @Memoize() getId(n: number) { return fn(n) } }
      const instance = new MyClass()
      const id1 = instance.getId(1)
      const id2 = instance.getId(1)
      const id3 = instance.getId(2)
      expect(id1).toStrictEqual(id2)
      expect(id1).not.toStrictEqual(id3)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith(1)
      expect(fn).toHaveBeenCalledWith(2)
    })

    it('should preserve the method context', () => {
      class MyClass { value = { foo: 42 }; @Memoize() getValue() { return this?.value } }
      const instance = new MyClass()
      const result1 = instance.getValue()
      const result2 = instance.value
      expect(result1).toBe(result2)
    })
  })
})
