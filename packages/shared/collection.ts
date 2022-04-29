type Key = string | number | symbol

export const chunk = <T>(array: T[], chunkSize: number): T[][] => {
  const arrayChunked = []
  for (let index = 0; index < array.length; index += chunkSize)
    arrayChunked.push(array.slice(index, index + chunkSize))
  return arrayChunked
}

export const uniq = <T>(array: T[]) =>
  [...new Set(array)]

export const compact = <T>(array: T[]) =>
  uniq(array.filter(Boolean))

// export const get = <T>(object: Record)

export const omit = <T, K extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

export const pick = <T, K extends Key>(object: Record<Key, T>, iterator: ((value: T, key: Key) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => !iterator(<T>value, <K>key))
  return <Record<K, T>>Object.fromEntries(entries)
}

export const mapValues = <T, K extends Key, TResult>(object: Record<K, T>, iterator: ((value: T, key: K) => TResult)) => {
  const entries = Object.entries(object).map(([key, value]) => [key, iterator(<T>value, <K>key)])
  return <Record<K, TResult>>Object.fromEntries(entries)
}

export const mapKeys = <T, K extends Key, KResult extends Key>(object: Record<K, T>, iterator: ((value: T, key: K) => KResult)) => {
  const entries = Object.entries(object).map(([key, value]) => [iterator(<T>value, <K>key), value])
  return <Record<KResult, T>>Object.fromEntries(entries)
}
