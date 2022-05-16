interface Get {
  (): undefined
  <T>(object: T): undefined
  <T, K extends keyof T>(object: T, path: K): T[K]
  <T, K1 extends keyof T, K2 extends keyof T[K1]>(object: T, path1: K1, path2: K2): T[K1][K2]
  <T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(object: T, path1: K1, path2: K2): T[K1][K2][K3]
  <T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(object: T, path1: K1, path2: K2): T[K1][K2][K3][K4]
  (object: any, ...paths: (string | number | symbol)[]): any
}

/**
 *
 * @param object
 * @param iterator
 */
export const get: Get = (object?: any, iterator?: any) => {
  if (!object || iterator === null || iterator === undefined) return
  if (typeof iterator === 'number') return object[iterator]
  if (typeof iterator === 'symbol') return object[iterator]
  if (typeof iterator === 'string') iterator = iterator.split('.')
  for (const key of iterator) object = object[key]
  return object
}
