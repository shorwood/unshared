import { set } from './set'

describe('set', () => {
  test('should return the reference to the object', () => {
    const object = {}
    const result = set(object, 'a.b.c', 1)
    expect(result).toBe(object)
  })

  test('should set a value at a path of keys', () => {
    const result = set({ a: { b: { c: 2 } } }, 'a.b.c', 1)
    expect(result).toStrictEqual({ a: { b: { c: 1 } } })
  })

  test('should create an object if the path does not exist', () => {
    const result = set({}, 'a.b.c', 1)
    expect(result).toStrictEqual({ a: { b: { c: 1 } } })
  })

  test('should create an array if the path does not exist', () => {
    const result = set({}, 'a.0.c', 1)
    expect(result).toStrictEqual({ a: [{ c: 1 }] })
  })
})
