/**
 * Hashes a string using the [Cyrb53](https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js) algorithm.
 * @param {string} data The string to hash
 * @param {number} seed A seed value
 * @returns {number} The hashed number
 * @See https://github.com/bryc
 */
export const hashCyrb53 = (value: string, seed = 0): string => {
  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (let index = 0, ch; index < value.length; index++) {
    ch = value.charCodeAt(index)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(32)
}
