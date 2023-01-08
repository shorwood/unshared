/**
 * Hashes a string using the [Cyrb53](https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js) algorithm.
 * @param data The string to hash
 * @param seed A seed value (default: `0`)
 * @return The hashed number
 * @See https://github.com/bryc
 */
export const hashCyrb53 = (data: ArrayBufferLike, seed = 0): ArrayBuffer => {
  const bytes = new Uint32Array(data)

  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (const byte of bytes) {
    h1 = Math.imul(h1 ^ byte, 2654435761)
    h2 = Math.imul(h2 ^ byte, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0)
  return new Uint8Array([hash]).buffer
}
