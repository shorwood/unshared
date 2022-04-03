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

export const omit = <T>(object: Record<string, T>, iterator: ((value: T, key: string) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key))
  return Object.fromEntries(entries)
}

export const pick = <T>(object: Record<string, T>, iterator: ((value: T, key: string) => boolean)) => {
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key))
  return Object.fromEntries(entries)
}
