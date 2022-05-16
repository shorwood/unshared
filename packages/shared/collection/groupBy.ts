import { Iterator } from '../types'

interface GroupBy {
  <T, K extends keyof T>(object: Array<T>, path: K): Record<string, T[]>
  <T>(object: Array<T>, iterator: Iterator<T, keyof T, string>): Record<string, T[]>
}

/**
 *
 * @param object
 * @param iterator
 */
export const groupBy: GroupBy = (object: any, iterator: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (v: any) => v[path]
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: Record<string, any[]> = {}
  object.forEach((v: any, k: any) => {
    const key = iterator(v, k)
    result[key] = [...result[key] ?? [], v]
  })

  // --- Return result.
  return result
}
