import { Key, Path } from '@unshared/types'

/**
 * Set a value of a nested object's property by a path of keys.
 * If the path does not exist, it will be created.
 *
 * @param object The object to set the value to
 * @param path The path of keys separated by a dot
 * @param value The value to set to the path
 * @returns The object with the value set to the path
 */
export function set<T extends object, K extends Path<T>>(object: T, path: K, value: unknown): T
export function set<T extends object>(object: T, path: Key, value: unknown): T
export function set(object: unknown, path: Key, value?: unknown): unknown {

  // --- If path is not a string, set the value to the path and return early.
  if (typeof path !== 'string') {
    object[path] = value
    return object
  }

  // --- Loop through the keys in the path.
  const keys = path.split('.')
  let current = object
  for (let index = 0; index < keys.length - 1; index++) {
    const key = keys[index]
    const nextKey = keys[index + 1]

    // --- If current value is undefined, create an object or array.
    // --- depending on the next key. (If next key is a number, create an array)
    // @ts-expect-error: Non-existant keys will be created.
    if (current?.[key] === undefined) current[key] = /^\d+$/.test(nextKey) ? [] : {}

    // --- Set current to the next value.
    // @ts-expect-error: Key is guaranteed to exist.
    current = current[key]
  }

  // --- Set value.
  const lastkey = keys.at(-1)
  if (lastkey !== undefined) current[lastkey] = value
  return object
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return the reference to the object', () => {
    const object = {}
    const result = set(object, 'a.b.c', 1)
    expect(result).toBe(object)
  })

  it('should set a value at a path of keys', () => {
    const result = set({ a: { b: { c: 2 } } }, 'a.b.c', 1)
    expect(result).toEqual({ a: { b: { c: 1 } } })
  })

  it('should create an object if the path does not exist', () => {
    const result = set({}, 'a.b.c', 1)
    expect(result).toEqual({ a: { b: { c: 1 } } })
  })

  it('should create an array if the path does not exist', () => {
    const result = set({}, 'a.0.c', 1)
    expect(result).toEqual({ a: [{ c: 1 }] })
  })
}
