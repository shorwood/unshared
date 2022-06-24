/**
 * Hash a string using Jenkins' hash function.
 * @param data String to hash.
 * @see https://www.wikiwand.com/en/Jenkins_hash_function
 */
export function hashJenkins(data: string) {
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
