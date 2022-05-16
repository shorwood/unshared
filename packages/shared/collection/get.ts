import { Key, MaybeArray } from '../types'

export type Get = <U>(object: any, path: MaybeArray<Key>) => U

/**
 *
 * @param object
 * @param path
 */
export const get: Get = (object: any, path: any): any => {
  if (!Array.isArray(path)) path = [path]
  path
    .flatMap((key: any) => key.split('.'))
    .forEach((key: any) => object = object[key])
  return object
}
