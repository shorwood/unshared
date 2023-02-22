/**
 * Hashes the given data using the [Jenkins](https://www.wikiwand.com/en/Jenkins_hash_function) algorithm.
 *
 * @param data The data to hash.
 * @returns The hash of the data.
 * @see https://www.wikiwand.com/en/Jenkins_hash_function
 */
export function hashJenkins(data: ArrayBufferLike): ArrayBuffer {
  const bytes = new Uint32Array(data)

  let hash = 0
  for (const byte of bytes) {
    hash += byte
    hash += (hash << 10)
    hash ^= (hash >> 6)
  }
  hash += (hash << 3)
  hash ^= (hash >> 11)
  hash += (hash << 15)
  return new Uint32Array([hash]).buffer
}
