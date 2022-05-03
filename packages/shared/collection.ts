type Key = string | number

export const chunk = <T>(array: Array<T>, chunkSize: number): Array<T>[] => {
  const arrayChunked = []
  for (let index = 0; index < array.length; index += chunkSize)
    arrayChunked.push(array.slice(index, index + chunkSize))
  return arrayChunked
}

export const uniq = <T>(array: Array<T>) =>
  [...new Set(array)]

export const compact = <T>(array: Array<T>): Array<Exclude<T, false | '' | 0 | null | undefined>> =>
  <any>uniq(array.filter(Boolean))

// export const get = <T>(object: Record)

export const omit = <T, K extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => !iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

export const pick = <T, K extends Key>(object: Record<Key, T>, iterator: ((value: T, key: Key) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

export const mapValues = <T, K extends Key, TResult>(object: Record<K, T>, iterator: ((value: T, key: K) => TResult)) => {
  const entries = Object.entries(object).map(([key, value]) => [key, iterator(<T>value, <K>key)])
  return <Record<K, TResult>>Object.fromEntries(entries)
}

interface MapKeys {
  <T, K extends Key, KResult extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => KResult)): Record<KResult, T>
  <T, KResult extends Key>(object: Array<T>, iterator: ((value: T, key: number) => KResult)): Record<KResult, T>
}

export const mapKeys: MapKeys = (object: any, iterator: any) => {
  const entries = Array.isArray(object)
    ? object.map((value, key) => [iterator(<any>value, <any>key), value])
    : Object.entries(object).map(([key, value]) => [iterator(<any>value, <any>key), value])
  return Object.fromEntries(entries)
}

export const arrayify = <T>(value: T | T[]) => (
  Array.isArray(value) ? value : [value]
)
