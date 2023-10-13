import { Collection } from '@unshared/types'

/**
 * The return type of the {@link values} function.
 *
 * @template T The type of the values.
 * @template K The type of the key property.
 * @example ValuesReturnType<{ foo: 'bar' }> // ['bar']
 */
type ValuesReturnType<T, K extends string | undefined> =
  T extends object
    ? K extends string
      ? Array<T & { [P in K]: string }>
      : T[]
    : never

/**
 * Extract the values of an object into an array. Optionally, you can specify
 * a property name to store the original key of each value.
 *
 * @param object The collection to cast as an array.
 * @param keyProperty The name of the property to store the original key.
 * @returns An array of items.
 * @example values({ key1: { foo: 'bar' }}) // [{ foo: 'bar', key: 'key1' }]
 */
export function values<T, K extends string>(object: Collection<T>, keyProperty?: K): ValuesReturnType<T, K> {
  // @ts-expect-error: TS can't infer the type of the return value.
  return keyProperty === undefined
    ? Object.values(object)
    : Object.entries(object).map(([originalKey, value]) => ({ [keyProperty]: originalKey, ...value }))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extract the values of an object into an array', () => {
    const result = Object.values({ foo: 'bar' })
    expect(result).toEqual(['bar'])
    expectTypeOf(result).toEqualTypeOf<string[]>()
  })

  it('should extract the values of an object into an array with the original key', () => {
    const result = values({ foo: { bar: 'baz' } }, 'key')
    expect(result).toEqual([{ key: 'foo', value: 'bar' }])
  })
}
