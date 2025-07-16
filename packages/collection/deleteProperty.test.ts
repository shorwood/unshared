import { deleteProperty } from './deleteProperty'

describe('deleteProperty', () => {
  describe('with objects', () => {
    const createObject = () => ({
      emails: ['jdoe@example.com', 'jdoe@acme.com'],
      firstName: 'John',
      friends: [{ firstName: 'Jane', lastName: 'Doe' }, { firstName: 'Jack', lastName: 'Doe' }],
      lastName: 'Doe',
    } as const)

    it('should delete a property at the path of an object', () => {
      const object = { foo: 'bar' }
      deleteProperty(object, 'foo')
      expect(object).toMatchObject({})
    })

    it('should delete a property at the path of a nested object with array index', () => {
      const object = createObject()
      deleteProperty(object, 'friends.0.firstName')
      expect(object.friends[0]).not.toHaveProperty('firstName')
    })

    it('should not mutate the object if the path does not exist', () => {
      const object = createObject()
      const expected = createObject()
      deleteProperty(object, 'invalid.path')
      expect(object).toMatchObject(expected)
    })

    it('should return undefined', () => {
      const result = deleteProperty({ foo: 'bar' }, 'foo')
      expect(result).toBeUndefined()
    })
  })

  describe('with arrays', () => {
    it('should delete an element at the path of an array', () => {
      const array = ['foo', 'bar', 'baz']
      deleteProperty(array, '1')
      expect(array).toMatchObject(['foo', undefined, 'baz'])
    })
  })

  describe('with Maps', () => {
    it('should delete a property of a Map', () => {
      const map = new Map()
      map.set('foo', 'bar')
      map.set('bar', 'baz')
      deleteProperty(map, 'foo')
      const expected = new Map()
      expected.set('bar', 'baz')
      expect(map).toMatchObject(expected)
    })
  })

  describe('with Sets', () => {
    it('should delete a property of a Set', () => {
      const set = new Set()
      set.add('foo')
      deleteProperty(set, 'foo')
      const expected = new Set()
      expect(set).toMatchObject(expected)
    })
  })

  describe('prevent prototype pollution', () => {
    const dangerousKeys = ['__proto__', 'constructor', 'prototype']

    for (const key of dangerousKeys) {
      it(`should throw an error if the path is "${key}"`, () => {
        const shouldThrow = () => deleteProperty({}, key)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" at the end`, () => {
        const shouldThrow = () => deleteProperty({ a: { b: {} } }, `a.b.${key}`)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" in the middle`, () => {
        const shouldThrow = () => deleteProperty({ a: { b: {} } }, `a.${key}.c`)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })

      it(`should throw an error if the path contains "${key}" at the beginning`, () => {
        const shouldThrow = () => deleteProperty({ a: { b: {} } }, `${key}.c`)
        expect(shouldThrow).toThrow(`Prototype pollution attempt detected: ${key}`)
      })
    }
  })
})
