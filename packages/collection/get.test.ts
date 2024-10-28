import { get } from './get'

describe('get', () => {
  const object = {
    emails: [
      'jdoe@example.com',
      'jdoe@acme.com',
    ],
    firstName: 'John',
    friends: [
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Jack', lastName: 'Doe' },
    ],
    lastName: 'Doe',
  } as const

  test('should return value at the path of an object', () => {
    const result = get(object, 'firstName')
    expect(result).toBe('John')
    expectTypeOf(result).toEqualTypeOf<'John'>()
  })

  test('should return value at the path of a nested object with array index', () => {
    const result = get(object, 'friends.0.firstName')
    expect(result).toBe('Jane')
    expectTypeOf(result).toEqualTypeOf<'Jane'>()
  })

  test('should return undefined if the path does not exist', () => {
    const result = get(object, 'invalid.path')
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return undefined if one of the path segment is null', () => {

    const result = get({ foo: null }, 'foo.bar')
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return the value of a Proxied property', () => {
    const object = new Proxy({}, { get(_, property) { return property } })
    const result = get(object, 'foo')
    expect(result).toBe('foo')
  })
})
