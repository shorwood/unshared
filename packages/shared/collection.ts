type Key = string | number | symbol

export const chunk = <T>(array: Array<T>, chunkSize: number): Array<T>[] => {
  const arrayChunked = []
  for (let index = 0; index < array.length; index += chunkSize)
    arrayChunked.push(array.slice(index, index + chunkSize))
  return arrayChunked
}

export const arrayify = <T>(value?: T | Array<T>): Array<T> =>
  (value ? (Array.isArray(value) ? value : [value]) : [])

export const uniq = <T>(array?: Array<T>) =>
  (array ? [...new Set(array)] : [])

export const compact = <T>(array?: Array<T>): Array<T> =>
  (array ? array.filter(Boolean) : [])

export const omit = <T, K extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => !iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

export const pick = <T, K extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

interface MapValues {
  <T, TResult>(object: Array<T>, iterator: ((value: T, key: number) => TResult)): Array<TResult>
  <T, K extends Key, TResult>(object: Record<K, T>, iterator: ((value: T, key: K) => TResult)): Record<K, TResult>
}

export const mapValues: MapValues = (object: any, iterator: any) => {
  const entries = Array.isArray(object)
    ? object.map((value, key) => [iterator(<any>value, <any>key), value])
    : Object.entries(object).map(([key, value]) => [key, iterator(<any>value, <any>key)])
  return Object.fromEntries(entries)
}

interface MapKeys {
  <T, KResult extends Key>(object: Array<T>, iterator: ((value: T, key: number) => KResult)): Record<KResult, T>
  <T, K extends Key, KResult extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => KResult)): Record<KResult, T>
}

export const mapKeys: MapKeys = (object: any, iterator: any) => {
  const entries = Array.isArray(object)
    ? object.map((value, key) => [iterator(<any>value, <any>key), value])
    : Object.entries(object).map(([key, value]) => [iterator(<any>value, <any>key), value])
  return Object.fromEntries(entries)
}

interface Map {
  <T, TResult>(object: T[], iterator: ((value: T, key: number) => TResult)): T[]
  <T, K extends Key, TResult>(object: Record<K, T>, iterator: ((value: T, key: K) => TResult)): T[]
}

export const map: Map = (object: any, iterator: any) => (
  Array.isArray(object)
    ? object.map((value, key) => iterator(<any>value, <any>key))
    : Object.entries(object).map(([key, value]) => iterator(<any>value, <any>key))
)

interface Get {
  <T, K extends keyof T>(object: T, path: K): T[K]
  <R = any>(object: any, path: string | number | symbol): R
  <R = any>(object: any, path: Array<string | number | symbol>): R
}

export const get: Get = (object: any, path: any) => {
  if (typeof path === 'number') return object?.[path]
  if (typeof path === 'symbol') return object?.[path]
  if (typeof path === 'string') path = path.split('.')
  for (const key of path) object = object?.[key]
  return object
}
