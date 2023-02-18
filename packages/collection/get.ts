import { Path } from '@unshared/types/Path'
import { Value } from '@unshared/types/collection'
import { Default } from '@unshared/types/common'

/**
 * Get a value from a nested object's property by a path of keys.
 *
 * @param object The object to get the value from.
 * @param path The path to the value.
 * @param defaultValue The default value to return if the path does not exist or is `undefined`.
 * @returns The value at the path or the default value.
 * @throws If the object is `undefined` or `null` or if the path is invalid.
 * @example get({ a: { b: [true] } }, 'a.b[0]') // true
 */
export function get<T, K extends Path<T>, U>(object: T, path: K, defaultValue?: U): Default<Value<T, K>, U>
/**
 * Get a value from a nested object's property with a getter function.
 *
 * @param object The object to get the value from.
 * @param getter The getter function.
 * @param defaultValue The default value to return if the getter returns `undefined`.
 * @throws If the object is `undefined` or `null` or if the getter is not a function.
 * @returns The value returned by the getter or the default value.
 */
export function get<T, R, U>(object: T, getter: (object: T) => R, defaultValue?: U): Default<R, U>
export function get(object: object, pathOrGetter?: string | Function, defaultValue?: unknown) {
  // --- Handle edge cases.
  if (object === undefined || object === null)
    throw new TypeError('Cannot get value from undefined or null object')
  if (typeof pathOrGetter !== 'string' && typeof pathOrGetter !== 'function')
    throw new TypeError('Cannot get value from object without a path or getter function')
  if (typeof pathOrGetter === 'string' && pathOrGetter.includes('..'))
    throw new SyntaxError('Cannot get value from object with a path containing ".."')

  // --- If the path is a function, call it and return the result.
  if (typeof pathOrGetter === 'function')
    return pathOrGetter(object) ?? defaultValue

  // --- Split path segments.
  const keys = typeof pathOrGetter === 'string'
    ? pathOrGetter.split('.')
    : pathOrGetter

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    const value = result[key as keyof typeof result]
    if (value === undefined) return defaultValue
    else result = value
  }

  // --- Return result.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  const object = { a: { b: { c: 1, d: [true] } } } as const

  it('should return value at the path of a nested object', () => {
    const result = get(object, 'a.b.c')
    expect(result).toEqual(object.a.b.c)
  })

  it('should return value at the path of a nested object with array index', () => {
    const result = get(object, 'a.b.d.0')
    expect(result).toEqual(object.a.b.d[0])
  })

  it('should return undefined if the path does not exist', () => {
  // @ts-expect-error: path does not exist
    const result = get(object, '')
    expect(result).toBeUndefined()
  })

  it('should return the default value if the path does not exist', () => {
  // @ts-expect-error: path does not exist
    const result = get(object, 'a.undefined', 'default')
    expect(result).toEqual('default')
  })

  it('should return the value from the getter function', () => {
    const result = get(object, object => object.a.b.c)
    expect(result).toEqual(object.a.b.c)
  })

  it('should return the default value if the getter function returns undefined', () => {
    const result = get(object, () => {}, 'default')
    expect(result).toEqual('default')
  })

  it('should throw an error if the path contains ".."', () => {
    // @ts-expect-error: path is invalid
    const shouldThrow = () => get(object, 'a..b')
    expect(shouldThrow).toThrow()
  })

  it('should throw an error if the object is undefined', () => {
    // @ts-expect-error: object is undefined
    const shouldThrow = () => get(undefined, 'a.b')
    expect(shouldThrow).toThrow()
  })

  it('should throw an error if the object is null', () => {
    // @ts-expect-error: object is null
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => get(null, 'a.b')
    expect(shouldThrow).toThrow()
  })

  it('should throw an error if the path is not a string or function', () => {
    // @ts-expect-error: path is not a string or function
    const shouldThrow = () => get(object, 1)
    expect(shouldThrow).toThrow()
  })

  it('should infer the type of the result from a path of a nested object', () => {
    const result = get(object, 'a.b.c')
    expectTypeOf(result).toEqualTypeOf<1>()
  })

  // TODO: [collection/get] Improve type inference for array index.
  it.todo('should infer the type of the result from a path of a nested object with array index', () => {
    const result = get(object, 'a.b.d.0')
    // @ts-expect-error: type is not inferred correctly
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should infer the type of the result from the getter function', () => {
    const result = get(object, object => object.a.b.c)
    expectTypeOf(result).toEqualTypeOf<1>()
  })
}
