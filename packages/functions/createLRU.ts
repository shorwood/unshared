/**
 * Create an LRU cache that can be configured with a maximum size,
 * and will evict the least recently used item when the cache is full.
 * 
 * @param maxSize The maximum size of the cache.
 * @returns The LRU cache.
 */
export class LRU<K, V> extends Map<K, V>{
  /**
   * Instantiate an LRU cache.
   * 
   * @param maxSize The maximum size of the cache.
   */
  constructor(private maxSize: number) {
    super();
  }

  /** A sorted list of the keys in the cache, from least recently used to most recently used. */
  private keyUsage: K[] = [];
  
  clear(): void {
    super.clear();
    this.keyUsage = [];    
  }

  delete(key: K): boolean {
  throw new Error("Method not implemented.");
  }
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
  throw new Error("Method not implemented.");
  }
  get(key: K): V | undefined {
  throw new Error("Method not implemented.");
  }
  has(key: K): boolean {
  throw new Error("Method not implemented.");
  }
  set(key: K, value: V): this {
  throw new Error("Method not implemented.");
  }
  size: number;
  entries(): IterableIterator<[K, V]> {
  throw new Error("Method not implemented.");
  }
  keys(): IterableIterator<K> {
  throw new Error("Method not implemented.");
  }
  values(): IterableIterator<V> {
  throw new Error("Method not implemented.");
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
  throw new Error("Method not implemented.");
  }
  [Symbol.toStringTag]: string;
    /**
     * Instantiate an LRU cache.
     */