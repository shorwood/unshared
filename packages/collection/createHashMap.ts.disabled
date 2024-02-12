wwimport { performance } from 'node:perf_hooks'

interface HashMap<K, V> {
  get(key: K): V | undefined
  set(key: K, value: V): void
  size: number
}

// HashMap using raw key-value pairs.
function createHashMapKV<K, V>(): HashMap<K, V> {
  const map: Array<[K, V]> = []
  let size = 0


  return {
    get(key: K) {
      for (const [k, v] of map)
        if (k === key) return v
    },
    set(key: K, value: V) {
      map.unshift([key, value])
      size++
    },
    get size() {
      return size
    },
  }
}

function benchmark(fn: Function, duration = 1000) {
  const start = performance.now()
  let count = 0
  let last = start

  while (last - start < duration) {
    fn()
    last = performance.now()
    count++
  }

  return count
}

function randomString() {
  return Math.random().toString(36).slice(7)
}

function main() {
  // Create the data to use for the benchmark.
  const keys = Array.from({ length: 1_000 }, () => randomString())

  // Create the HashMap.
  const hashKv = createHashMapKV<string, string>()
  keys.forEach(key => hashKv.set(key, key))

  // Create the Map
  const map = new Map<string, string>()
  keys.forEach(key => map.set(key, key))

  // Create simple object.
  const object: Record<string, string> = {}
  keys.forEach(key => object[key] = key)

  // Benchmark the implementation.
  console.log({
    'createHashMapKV()': 1000 * benchmark(() => keys.forEach(key => hashKv.get(key))),
    'new Map()': 1000 * benchmark(() => keys.forEach(key => map.get(key))),
    'object': 1000 * benchmark(() => keys.forEach(key => object[key])),
  })
}


main()
