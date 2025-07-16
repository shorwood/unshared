import { set } from './set'

describe('set', () => {
  describe('set value by path', () => {
    it('should return the reference to the object', () => {
      const object = {}
      const result = set(object, 'a.b.c', 1)
      expect(result).toBe(object)
    })

    it('should set a value at a path of keys', () => {
      const result = set({ a: { b: { c: 2 } } }, 'a.b.c', 1)
      expect(result).toStrictEqual({ a: { b: { c: 1 } } })
    })

    it('should create an object if the path does not exist', () => {
      const result = set({}, 'a.b.c', 1)
      expect(result).toStrictEqual({ a: { b: { c: 1 } } })
    })

    it('should create an array if the path does not exist', () => {
      const result = set({}, 'a.0.c', 1)
      expect(result).toStrictEqual({ a: [{ c: 1 }] })
    })
  })

  describe('prevent prototype pollution', () => {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype']

    for (const key of dangerousKeys) {
      it(`should throw an error if the path is "${key}"`, () => {
        const shouldThrow = () => set({}, key, 1)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" at the end`, () => {
        const shouldThrow = () => set({ a: { b: {} } }, `a.b.${key}`, 1)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" in the middle`, () => {
        const shouldThrow = () => set({ a: { b: {} } }, `a.${key}.c`, 1)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" in at the beginning`, () => {
        const shouldThrow = () => set({ a: { b: {} } }, `${key}.c`, 1)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })
    }
  })
})
