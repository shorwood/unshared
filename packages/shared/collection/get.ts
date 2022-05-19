import { Key, MaybeArray } from '../types'

interface Get {
  <U>(value: any, path: MaybeArray<Key>): U | undefined
  <U>(value: any, path: MaybeArray<Key>, defaultValue: U): U
}

/**
 *
 * @param object
 * @param path
 */
export const get: Get = (value, path, defaultValue?: any) => {
  if (!Array.isArray(path)) path = [path]
  path
    .flatMap((key: any) => key.split('.'))
    .forEach((key: any) => value = value?.[key])
  return value ?? defaultValue
}
