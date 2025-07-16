import { isIterable } from './isIterable'

export interface CacheOptions<K = unknown, V = unknown> {

  /**
   * The maximum number of entries to store in the cache before evicting
   * least recently used (LRU) entries. If not provided, the cache will not
   * evict entries based on the number of entries.
   *
   * Note that the cache will only delete entries when a new entry
   * is added. This means that garbabge collection and the `onEviction` callback
   * won't be called until AFTER the cache has reached its `max`.
   *
   * @example
   *
   * const cache = createCache<number, string>({ max: 2 })
   * cache.set(1, 'a')
   * cache.set(2, 'b')
   * cache.set(3, 'c')
   *
   * // The first entry was evicted because the cache is at its max.
   * cache.get(1) // undefined
   *
   * // The last entry is still in the cache.
   * cache.get(3) // 'c'
   */
  max?: number

  /**
   * Max time in milliseconds for items to live in cache before they are
   * considered stale. Note that stale items are NOT preemptively removed,
   * and MAY live in the cache for longer than the TTL. This is because the
   * cache will only remove items when a new item is added, and the cache
   * is at its `max` or `maxSize`.
   *
   * To force the cache to remove stale items, you can call the {@link Cache.purge}
   * method, or set a new item in the cache.
   *
   * Note that the TTL takes precedence over the `maxSize` and `max` options.
   * This means that when the max size or max number of entries is reached,
   * the cache will first evict expired items before evicting the least recently
   * used (LRU) item.
   *
   * @example
   *
   * const cache = createCache<number, string>({ ttl: 1000 })
   * cache.set(1, 'a')
   * cache.get(1) // 'a'
   *
   * // Wait for the TTL to expire.
   * await new Promise(resolve => setTimeout(resolve, 1000))
   *
   * // The item is now stale.
   * cache.get(1) // undefined
   */
  ttl?: number

  /**
   * The maximum size of the cache as measured by the `getSize` function.
   * This is used to determine when the cache has reached its `maxSize`, and
   * to evict items when necessary. If not provided, the cache will not
   * evict items based on size.
   *
   * Note that the cache will only delete entries when a new entry
   * is added. This means that garbabge collection and the `onEviction` callback
   * won't be called until AFTER the cache has reached its `maxSize`.
   *
   * @example
   *
   * const cache = createCache<number, string>({ maxSize: 10, getSize: (value: string) => value.length })
   * cache.set(1, 'Hello, World!')
   * cache.set(2, 'Hello, Universe!')
   *
   * // The first entry was evicted because the cache is at its maxSize.
   * cache.get(1) // undefined
   */
  maxSize?: number

  /**
   * Function to calculate the size of a value. This allows custom implementations
   * to determine the size of a value in bytes, characters, or any other unit that
   * may contribute the the memory usage of the cache.
   *
   * @example (value: string) => value.length
   */
  getSize?(this: this, value: V, key: K): number

  /**
   * The function to call when a key was evicted from the cache. This will
   * only occur when a new key is set, and the cache is at its `max` or
   * `maxSize`.
   *
   * @example (value: Uint8Array) => value.fill(0)
   */
  onEviction?(this: this, value: V, key: K): void
}

interface CacheEntryMeta {

  /**
   * The size of the entry as calculated by the `getSize` function.
   */
  size: number

  /**
   * The time at which the entry will expire. When an expired entry is
   * accessed, it will return `undefined` but won't be removed from the
   * cache until a new entry is added or the `purge` method is called.
   */
  expiresAt: number

  /**
   * The last time the entry was accessed. This is updated every time
   * the entry is accessed via `get` or `set`.
   */
  lastUsedAt: number
}

/**
 * A `Map`-like cache that can be configured as an LRU (Least Recently Used) and/or TTL (Time-To-Live) cache.
 * This class extends the native `Map` and provides additional functionality to manage cache entries
 * based on their usage and expiration time.
 *
 * @template K The type of the keys in the cache.
 * @template V The type of the values in the cache.
 */
export class Cache<K, V> extends Map<K, V> implements CacheOptions<K, V> {
  private meta = new Map<K, CacheEntryMeta>()
  private totalSize = 0

  public max = Number.POSITIVE_INFINITY
  public ttl = Number.POSITIVE_INFINITY
  public maxSize = Number.POSITIVE_INFINITY
  public getSize?: CacheOptions<K, V>['getSize']
  public onEviction?: CacheOptions<K, V>['onEviction']

  constructor(entries?: ReadonlyArray<[K, V]>, options?: CacheOptions<K, V>)
  constructor(entries?: Iterable<[K, V]>, options?: CacheOptions<K, V>)
  constructor(options?: CacheOptions<K, V>)
  constructor(entriesOrOptions?: CacheOptions<K, V> | Iterable<[K, V]> | ReadonlyArray<[K, V]>, maybeOptions?: CacheOptions<K, V>)
  constructor(entriesOrOptions?: CacheOptions<K, V> | Iterable<[K, V]> | ReadonlyArray<[K, V]>, maybeOptions: CacheOptions<K, V> = {}) {

    // --- Normalize arguments.
    const entries = isIterable(entriesOrOptions) ? entriesOrOptions : []
    const options = isIterable(entriesOrOptions) ? maybeOptions : entriesOrOptions ?? {}
    super()

    // --- Assign options.
    if (options.max !== undefined) this.max = options.max
    if (options.ttl !== undefined) this.ttl = options.ttl
    if (options.maxSize !== undefined) this.maxSize = options.maxSize
    if (options.getSize !== undefined) this.getSize = options.getSize.bind(this)
    if (options.onEviction !== undefined) this.onEviction = options.onEviction.bind(this)

    // --- Batch initialize entries.
    for (const [key, value] of entries) {
      if (this.size >= this.max || this.totalSize >= this.maxSize) break
      const size = this.getSize ? this.getSize(value, key) : 1
      const expiresAt = this.ttl ? (Date.now() + this.ttl) : Number.POSITIVE_INFINITY
      const lastUsedAt = Date.now()
      super.set(key, value)
      this.totalSize += size
      this.meta.set(key, { size, expiresAt, lastUsedAt })
    }
  }

  /**
   * Set a value in the cache. This will update or set the `lastUsedAt` time
   * for the entry, and update the `expiresAt` time if the `ttl` option is set.
   * If the cache is at its `max` or `maxSize`, this will evict the least
   * recently used entry until the constraints are satisfied.
   *
   * @param key The key to set in the cache.
   * @param value The value to set in the cache.
   * @returns The cache instance.
   * @example cache.set('key', 'value')
   */
  set(key: K, value: V): this {
    const size = this.getSize ? this.getSize(value, key) : 1
    const expiresAt = this.ttl ? (Date.now() + this.ttl) : Number.POSITIVE_INFINITY
    const lastUsedAt = Date.now()

    // --- If the key already exists, decrement the total size by the
    // --- existing size before we re-increment it with the new size.
    const existing = this.meta.get(key)
    if (existing) this.totalSize -= existing.size

    // --- Set the value and metadata. Also, purge the cache to ensure
    // --- it is within it's constraints. This will effectively evict
    // --- the least recently used entry if the cache is full.
    super.set(key, value)
    this.totalSize += size
    this.meta.set(key, { size, expiresAt, lastUsedAt })
    if (this.size > this.max || this.totalSize > this.maxSize) this.evict()
    return this
  }

  /**
   * Get a value from the cache. This will also update the `lastUsedAt` time for
   * the entry, and return the value if it exists and has not expired.
   *
   * @param key The key to get from the cache.
   * @returns The value if it exists and has not expired, `undefined` otherwise.
   * @example cache.get('key')
   */
  get(key: K): undefined | V {
    const now = Date.now()
    const meta = this.meta.get(key)
    if (!meta) return undefined
    if (meta.expiresAt < now) return undefined
    meta.lastUsedAt = now
    return super.get(key)
  }

  /**
   * Check if a key exists in the cache and has not expired. Note that this
   * will not update the `lastUsedAt` time for the entry.
   *
   * @param key The key to check in the cache.
   * @returns `true` if the key exists and has not expired, `false` otherwise.
   * @example cache.has('key')
   */
  has(key: K): boolean {
    const now = Date.now()
    const meta = this.meta.get(key)
    if (!meta) return false
    return meta.expiresAt > now
  }

  /**
   * Delete an entry from the cache. This will also call the `onEviction`
   * callback for the entry if it exists.
   *
   * @param key The key to delete from the cache.
   * @returns `true` if the entry was deleted, `false` otherwise.
   * @example cache.delete('key')
   */
  delete(key: K): boolean {
    const value = super.get(key)
    if (value === undefined) return false
    if (this.onEviction) this.onEviction(value, key)
    this.totalSize -= this.meta.get(key)!.size
    this.meta.delete(key)
    return super.delete(key)
  }

  /**
   * Clear all entries from the cache. This will also call the `onEviction`
   * callback for each entry in the cache. This is useful for cleaning up
   * resources when the cache is no longer needed.
   *
   * @example cache.clear()
   */
  clear(): void {
    if (this.onEviction) {
      for (const [key, value] of this)
        this.onEviction(value, key)
    }
    super.clear()
    this.meta.clear()
  }

  /**
   * Evict entries from the cache until the cache constraints are satisfied.
   * This function will first evict expired entries, and then evict the least
   * recently used entry until the cache is within its `max` and `maxSize`.
   *
   * @example cache.evict()
   */
  evict(): void {
    const now = Date.now()
    let lruKey: K | undefined
    let lruTime = Number.POSITIVE_INFINITY

    for (const [key, { expiresAt, lastUsedAt }] of this.meta) {
      if (expiresAt < now) {
        lruKey = key
        break
      }
      if (lastUsedAt < lruTime) {
        lruTime = lastUsedAt
        lruKey = key
      }
    }
    if (lruKey) this.delete(lruKey)
  }

  /**
   * Purge all expired entries from the cache. This will remove all entries
   * that have expired based on the `ttl` option and the time at which the
   * entries were set or updated.
   *
   * @example cache.purge()
   */
  purge(): void {
    const now = Date.now()
    for (const [key, meta] of this.meta)
      if (meta.expiresAt < now) this.delete(key)
  }
}

/**
 * Create a new `Map`-like cache that can be configured as an LRU and/or TTL cache.
 *
 * @param entries The entries to initialize the cache with.
 * @param options The options to configure the cache with.
 * @returns The new cache instance.
 * @example
 * const cache = createCache<number, string>({ max: 2 })
 * cache.set(1, 'a')
 * cache.set(2, 'b')
 * cache.set(3, 'c')
 *
 * // The first entry was evicted because the cache is at its max.
 * cache.get(1) // undefined
 *
 * // The last entry is still in the cache.
 * cache.get(3) // 'c'
 */
export function createCache<K, V>(entries?: ReadonlyArray<[K, V]>, options?: CacheOptions<K, V>): Cache<K, V>
export function createCache<K, V>(entries?: Iterable<[K, V]>, options?: CacheOptions<K, V>): Cache<K, V>
export function createCache<K, V>(options?: CacheOptions<K, V>): Cache<K, V>

/**
 * Creates a new cache instance with optional initial entries and configuration options.
 *
 * @template K - The type of keys stored in the cache
 * @template V - The type of values stored in the cache
 * @param entriesOrOptions Either an iterable of key-value pairs to initialize the cache with, or cache configuration options
 * @param maybeOptions Additional cache configuration options when the first parameter contains initial entries
 * @returns A new Cache instance configured with the provided options and initial entries
 *
 * @example
 * ```typescript
 * // Create empty cache with options
 * const cache = createCache<string, number>({ maxSize: 100 });
 *
 * // Create cache with initial entries
 * const cache = createCache([['key1', 'value1'], ['key2', 'value2']]);
 *
 * // Create cache with both initial entries and options
 * const cache = createCache([['key1', 'value1']], { maxSize: 50 });
 * ```
 */
export function createCache<K, V>(entriesOrOptions?: CacheOptions<K, V> | Iterable<[K, V]> | ReadonlyArray<[K, V]>, maybeOptions?: CacheOptions<K, V>): Cache<K, V>
export function createCache<K, V>(entriesOrOptions?: CacheOptions<K, V> | Iterable<[K, V]> | ReadonlyArray<[K, V]>, maybeOptions?: CacheOptions<K, V>): Cache<K, V> {
  return new Cache(entriesOrOptions, maybeOptions)
}
