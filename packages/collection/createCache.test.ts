/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Cache, createCache } from './createCache'

describe('createCache', () => {
  describe('constructor', () => {
    it('should create a new cache with the given array entries', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
    })

    it('should create a new cache with the given iterable entries', () => {
      const iterable = new Map([[1, 'a'], [2, 'b']])
      const cache = createCache(iterable)
      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
    })

    it('should create a new cache with the given array entries and options', () => {
      const cache = createCache([[1, 'a'], [2, 'b']], { max: 2 })
      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
      expect(cache.max).toBe(2)
    })

    it('should create a new cache with the given iterable entries and options', () => {
      const iterable = new Map([[1, 'a'], [2, 'b']])
      const cache = createCache(iterable, { max: 2 })
      expect(cache.get(1)).toBe('a')
      expect(cache.get(2)).toBe('b')
      expect(cache.max).toBe(2)
    })

    it('should create a new cache with the given options', () => {
      const cache = createCache({ max: 2 })
      expect(cache.max).toBe(2)
    })

    it('should respect the `max` option', () => {
      const cache = createCache([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']], { max: 2 })
      expect([...cache]).toEqual([[1, 'a'], [2, 'b']])
    })

    it('should respect the `maxSize` option', () => {
      const cache = createCache([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']], { maxSize: 20, getSize: () => 10 })
      expect([...cache]).toEqual([[1, 'a'], [2, 'b']])
    })
  })

  describe('inheritance', () => {
    it('should be an instance of Cache', () => {
      const cache = createCache()
      expect(cache).toBeInstanceOf(Cache)
    })

    it('should inherit from Map', () => {
      const cache = createCache()
      expect(cache).toBeInstanceOf(Map)
    })

    it('should be iterable', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      const entries = [...cache]
      expect(entries).toEqual([[1, 'a'], [2, 'b']])
    })

    it('should have iterable keys', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      const keys = [...cache.keys()]
      expect(keys).toEqual([1, 2])
    })

    it('should have iterable values', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      const values = [...cache.values()]
      expect(values).toEqual(['a', 'b'])
    })
  })

  describe('set', () => {
    it('should return the cache instance', () => {
      const cache = createCache()
      const result = cache.set(1, 'a')
      expect(result).toBe(cache)
    })

    it('should set a new entry', () => {
      const cache = createCache()
      cache.set(1, 'a')
      expect(cache.get(1)).toBe('a')
    })

    it('should set the metadata for the entry', () => {
      const cache = createCache([[1, 'a']])
      // @ts-expect-error: private property
      const meta = cache.meta.get(1)
      expect(meta).toEqual({
        expiresAt: Number.POSITIVE_INFINITY,
        lastUsedAt: expect.any(Number),
        size: 1,
      })
    })

    it('should set the expiresAt metadata for the entry based on the ttl option', () => {
      vi.useFakeTimers()
      const now = Date.now()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      // @ts-expect-error: private property
      const meta = cache.meta.get(1)!
      expect(meta.expiresAt).toBe(now + 100)
      vi.useRealTimers()
    })

    it('should update the expiresAt when setting an existing entry', () => {
      vi.useFakeTimers()
      const now = Date.now()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(50)
      cache.set(1, 'b')
      // @ts-expect-error: private property
      const meta = cache.meta.get(1)!
      expect(meta.expiresAt).toBe(now + 150)
      vi.useRealTimers()
    })

    it('should increment the size of the cache', () => {
      const cache = createCache()
      cache.set(1, 'a')
      cache.set(2, 'a')
      expect(cache.size).toBe(2)
    })

    it('should call the `getSize` callback to determine the size of the entry', () => {
      const getSize = vi.fn(() => 2)
      const cache = createCache({ getSize })
      cache.set(1, 'a')
      expect(getSize).toHaveBeenCalledWith('a', 1)
    })

    it('should increment the total size of the cache based on the getSize option', () => {
      const cache = createCache({ getSize: () => 2 })
      cache.set(1, 'a')
      // @ts-expect-error: private property
      expect(cache.totalSize).toBe(2)
    })

    it('should decrement and increment the total size of the cache when setting an existing entry', () => {
      const cache = createCache({ getSize: (value: string) => value.length })
      cache.set(1, 'Hello')
      // eslint-disable-next-line sonarjs/no-element-overwrite
      cache.set(1, 'Hi')
      // @ts-expect-error: private property
      expect(cache.totalSize).toBe(2)
    })
  })

  describe('set eviction', () => {
    it('should not evict when the cache is not full by count', () => {
      const cache = createCache({ max: 2 })
      const evict = vi.spyOn(cache, 'evict')
      cache.set(1, 'a')
      expect(evict).not.toHaveBeenCalled()
    })

    it('should evict when the cache is full by count', () => {
      const cache = createCache({ max: 2 })
      const evict = vi.spyOn(cache, 'evict')
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')
      expect(evict).toHaveBeenCalledTimes(1)
    })

    it('should not evict when the cache is not full by size', () => {
      const cache = createCache({ maxSize: 20, getSize: () => 10 })
      const evict = vi.spyOn(cache, 'evict')
      cache.set(1, 'a')
      expect(evict).not.toHaveBeenCalled()
    })

    it('should evict the least recently used entry when the cache is full by size', () => {
      const cache = createCache({ maxSize: 20, getSize: () => 10 })
      const evict = vi.spyOn(cache, 'evict')
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')
      expect(evict).toHaveBeenCalledTimes(1)
    })
  })

  describe('get', () => {
    it('should return the value of the entry', () => {
      const cache = createCache([[1, 'a']])
      const result = cache.get(1)
      expect(result).toBe('a')
    })

    it('should update the lastUsedAt metadata for the entry', () => {
      const cache = createCache([[1, 'a']])
      const now = Date.now()
      vi.useFakeTimers({ now })
      cache.get(1)
      // @ts-expect-error: private property
      const meta = cache.meta.get(1)
      expect(meta!.lastUsedAt).toBe(now)
      vi.useRealTimers()
    })

    it('should return undefined if the key does not exist', () => {
      const cache = createCache()
      const result = cache.get(1)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the entry is expired', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      const result = cache.get(1)
      expect(result).toBeUndefined()
      vi.useRealTimers()
    })

    it('should keep the interal values even if the entry is expired', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      cache.get(1)
      expect(cache.size).toBe(1)
      // @ts-expect-error: private property
      expect(cache.totalSize).toBe(1)
      vi.useRealTimers()
    })
  })

  describe('has', () => {
    it('should return true if the key exists', () => {
      const cache = createCache([[1, 'a']])
      const result = cache.has(1)
      expect(result).toBe(true)
    })

    it('should return false if the key does not exist', () => {
      const cache = createCache()
      const result = cache.has(1)
      expect(result).toBe(false)
    })

    it('should return false if the entry is expired', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      const result = cache.has(1)
      expect(result).toBe(false)
      vi.useRealTimers()
    })

    it('should not update the lastUsedAt metadata for the entry', () => {
      const now = Date.now()
      vi.useFakeTimers({ now })
      const cache = createCache([[1, 'a']])
      vi.advanceTimersByTime(100)
      cache.has(1)
      // @ts-expect-error: private property
      const meta = cache.meta.get(1)
      expect(meta!.lastUsedAt).toBe(now)
      vi.useRealTimers()
    })

    it('should keep the interal values even if the entry is expired', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      cache.has(1)
      expect(cache.size).toBe(1)
      // @ts-expect-error: private property
      expect(cache.totalSize).toBe(1)
      vi.useRealTimers()
    })
  })

  describe('clear', () => {
    it('should clear the cache', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      cache.clear()
      expect(cache.size).toBe(0)
    })

    it('should clear the metadata', () => {
      const cache = createCache([[1, 'a'], [2, 'b']])
      cache.clear()
      // @ts-expect-error: private property
      expect(cache.meta.size).toBe(0)
    })

    it('should call the `onEviction` callback for each entry', () => {
      const onEviction = vi.fn()
      const cache = createCache([[1, 'a'], [2, 'b']], { onEviction })
      cache.clear()
      expect(onEviction).toHaveBeenCalledTimes(2)
      expect(onEviction).toHaveBeenNthCalledWith(1, 'a', 1)
      expect(onEviction).toHaveBeenNthCalledWith(2, 'b', 2)
    })
  })

  describe('delete', () => {
    it('should return true if the entry was deleted', () => {
      const cache = createCache([[1, 'a']])
      const result = cache.delete(1)
      expect(result).toBe(true)
    })

    it('should return false if the key does not exist', () => {
      const cache = createCache()
      const result = cache.delete(1)
      expect(result).toBe(false)
    })

    it('should delete the entry', () => {
      const cache = createCache([[1, 'a']])
      cache.delete(1)
      expect(cache.get(1)).toBeUndefined()
    })

    it('should delete an entry that has a falsy value', () => {
      const cache = createCache([[1, false]])
      cache.delete(1)
      expect(cache.get(1)).toBeUndefined()
    })

    it('should delete the metadata', () => {
      const cache = createCache([[1, 'a']])
      cache.delete(1)
      // @ts-expect-error: private property
      expect(cache.meta.has(1)).toBe(false)
    })

    it('should decrement the total size of the cache based on the getSize option', () => {
      const cache = createCache({ getSize: () => 10 })
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.delete(1)
      // @ts-expect-error: private property
      expect(cache.totalSize).toBe(10)
    })

    it('should call the `onEviction` callback', () => {
      const onEviction = vi.fn()
      const cache = createCache([[1, 'a']], { onEviction })
      cache.delete(1)
      expect(onEviction).toHaveBeenCalledTimes(1)
      expect(onEviction).toHaveBeenCalledWith('a', 1)
    })
  })

  describe('purge', () => {
    it('should purge the expired entries', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      cache.purge()
      expect(cache.size).toBe(0)
      vi.useRealTimers()
    })

    it('should keep non-expired entries', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      vi.advanceTimersByTime(50)
      cache.set(2, 'b')
      vi.advanceTimersByTime(51)
      cache.purge()
      expect(cache.size).toBe(1)
      expect(cache.get(2)).toBe('b')
      vi.useRealTimers()
    })

    it('should call the `onEviction` callback for each entry', () => {
      const onEviction = vi.fn()
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100, onEviction })
      cache.set(1, 'a')
      vi.advanceTimersByTime(101)
      cache.purge()
      expect(onEviction).toHaveBeenCalledTimes(1)
      expect(onEviction).toHaveBeenCalledWith('a', 1)
      vi.useRealTimers()
    })
  })

  describe('evict', () => {
    it('should evict the first entry that was set', () => {
      const cache = createCache()
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')
      cache.evict()
      expect([...cache]).toEqual([[2, 'b'], [3, 'c']])
    })

    it('should evict the least recently used entry', () => {
      vi.useFakeTimers()
      const cache = createCache()
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.set(3, 'c')
      vi.advanceTimersByTime(50)
      cache.get(1)
      cache.get(2)
      cache.evict()
      expect([...cache]).toEqual([[1, 'a'], [2, 'b']])
      vi.useRealTimers()
    })

    it('should evict the first expired entry', () => {
      vi.useFakeTimers()
      const cache = createCache({ ttl: 100 })
      cache.set(1, 'a')
      cache.set(2, 'a')
      cache.set(3, 'b')
      // @ts-expect-error: private property
      const meta = cache.meta.get(3)!
      meta.expiresAt = 0
      cache.evict()
      expect([...cache]).toEqual([[1, 'a'], [2, 'a']])
      vi.useRealTimers()
    })

    it('should call the `onEviction` callback', () => {
      const onEviction = vi.fn()
      const cache = createCache({ onEviction })
      cache.set(1, 'a')
      cache.set(2, 'b')
      cache.evict()
      expect(onEviction).toHaveBeenCalledExactlyOnceWith('a', 1)
    })
  })
})
