/**
 *
 * @param data
 * @param seed
 */
export const hashCyrb53 = (data: string, seed = Math.random()) => {
  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (let index = 0, ch; index < data.length; index++) {
    ch = data.charCodeAt(index)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(32)
}

export function hashJenk(data: string) {
  let hash = 0
  for (const datum of data) {
    hash += datum.charCodeAt(0)
    hash += (hash << 10)
    hash ^= (hash >> 6)
  }
  hash += (hash << 3)
  hash ^= (hash >> 11)
  hash += (hash << 15)
  return (hash).toString(32)
}

/**
 * Hash a buffer or string and return it's base64 representation.
 * @param data String or buffer to hash.
 * @param algorithm Hashing algorithm
 */
export const hash = (data: string | ArrayBuffer, algorithm = 'jenk' as string) => {
  data = typeof data !== 'string' ? Buffer.from(data).toString() : data

  switch (algorithm) {
    case 'cybr53': return hashCyrb53(data)
    case 'jenk':
    case 'fast':
    default: return hashJenk(data)
  }
}
