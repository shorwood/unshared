import { expect, it } from 'vitest'
import { get } from './get'

it('should get a value from an object by a path of keys', () => {
  const object = { a: { b: { c: Math.random() > 0.5 ? 0 : 1 } } }
  expect(get(object, 'a')).toEqual(object.a)
  expect(get(object, 'a', 'default')).toEqual(object.a)
  expect(get(object, 'a.b')).toEqual(object.a.b)
  expect(get(object, 'a.b', 'default')).toEqual(object.a.b)
  expect(get(object, 'a.b.c')).toEqual(object.a.b.c)
  expect(get(object, 'a.b.c', 'default')).toEqual(object.a.b.c)
})

it('should get a value from an array in an object', () => {
  const object = { a: [{ b: 'c' }] }
  const array = [object]
  expect(get(object, 'a.0.b')).toEqual('c')
  expect(get(object, 'a.0.b', 'default')).toEqual('c')
  expect(get(array, '0.a.0.b')).toEqual('c')
  expect(get(array, '0.a.0.b', 'default')).toEqual('c')
})

it('should return the default value if the path does not exist', () => {
  const object = { a: { b: { c: 'd' } } }
  expect(get(object, 'invalid-path')).toBeUndefined()
  expect(get(object, 'invalid-path', 'default')).toEqual('default')
  expect(get(object, 'invalid-path')).toBeUndefined()
  expect(get(object, 'invalid-path', 'default')).toEqual('default')
})

it('should return default value if value is undefined or null', () => {
  expect(get(undefined, 'undefined')).toBeUndefined()
})
