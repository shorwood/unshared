
interface IPick {
  <T extends object, K extends keyof T>(object: T, path: K): Pick<T, K>
  <T extends object, K extends keyof T>(object: T, iterator: (value: T[K], key: K, object: T) => boolean): Partial<T>
  <T extends object>(object: T, path: any): Partial<T>
}

/**
 *
 * @param object
 * @param iterator
 */
export const pick: IPick = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any, key: any) => key === path
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}
