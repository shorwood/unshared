import type { Immutable } from '@unshared/types'

/**
 * Returns a deeply immutable proxy of the given object. This means that all
 * nested properties are readonly, and cannot be changed. The original object
 * can still be mutated and will be reflected in the immutable proxy.
 *
 * @param object The object to make immutable.
 * @returns An immutable object.
 * @example
 * const object = { a: 1, b: { c: 2 } }
 * const immutableObject = immutable(object)
 * immutableObject.a = 2 // Error
 */
export function immutable<T extends object>(object: T): Immutable<T> {
  return new Proxy(object, {
    deleteProperty() {
      return false
    },
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver) as unknown
      return typeof value === 'object' && value !== null
        ? immutable(value)
        : value
    },
    set() {
      return false
    },
  }) as Immutable<T>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a copy of the given object', () => {
    const object = { a: 1, b: { c: 2 } }
    const result = immutable(object)
    expect(result).toStrictEqual(object)
    expect(result).not.toBe(object)
    expectTypeOf(result).toEqualTypeOf<{ readonly a: number; readonly b: { readonly c: number } }>()
  })

  test('should return a copy of the given array', () => {
    const array = [1, 2, 3]
    const result = immutable(array)
    expect(result).toStrictEqual(array)
    expect(result).not.toBe(array)
    expectTypeOf(result).toEqualTypeOf<readonly number[]>()
  })

  test('should make all properties readonly', () => {
    const object = { a: 1, b: { c: 2 } }
    const result = immutable(object)

    // @ts-expect-error: defining readonly property
    const shouldThrow = () => result.a = 2
    expect(shouldThrow).toThrow('\'set\' on proxy: trap returned falsish for property \'a\'')
  })

  test('should make all nested properties readonly', () => {
    const object = { a: 1, b: { c: 2 } }
    const result = immutable(object)

    // @ts-expect-error: defining readonly property
    const shouldThrow = () => result.b.c = 3
    expect(shouldThrow).toThrow('\'set\' on proxy: trap returned falsish for property \'c\'')
  })

  test('should throw an error if the first parameter is not an object', () => {

    // @ts-expect-error: invalid parameter type
    const shouldThrow = () => immutable(1)
    expect(shouldThrow).toThrow('Cannot create proxy with a non-object as target or handler')
  })

  test('should throw an error if the given object is null', () => {

    // @ts-expect-error: invalid parameter type
    // eslint-disable-next-line unicorn/no-null
    const shouldThrow = () => immutable(null)
    expect(shouldThrow).toThrow('Cannot create proxy with a non-object as target or handler')
  })
}
