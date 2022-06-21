import { expect, it } from 'vitest'
import { get } from './get'

it('should get a value from an object by a path of keys', () => {
  const object = { a: { b: { c: 'd' } } }
  expect(get(object, 'a')).toEqual({ b: { c: 'd' } })
  expect(get(object, 'a', 'default')).toEqual({ b: { c: 'd' } })
  expect(get(object, 'a.b')).toEqual({ c: 'd' })
  expect(get(object, 'a.b', 'default')).toEqual({ c: 'd' })
  expect(get(object, 'a.b.c')).toEqual('d')
  expect(get(object, 'a.b.c', 'default')).toEqual('d')
})

it('should get a value from an object by a path of keys', () => {
  const object = { a: { b: { c: 'd' } } }
  expect(get(object, ['a', 'b', 'c'])).toEqual('d')
  expect(get(object, ['a', 'b', 'c'], 'default')).toEqual('d')
  expect(get(object, ['a.b', 'c'])).toEqual('d')
  expect(get(object, ['a.b', 'c'], 'default')).toEqual('d')
})

it('should get a value from a nested array in an object', () => {
  const object = { a: [{ b: 'c' }] }
  expect(get(object, ['a', 0, 'b'])).toEqual('c')
  expect(get(object, ['a', 0, 'b'], 'default')).toEqual('c')
  expect(get(object, ['a.0', 'b'])).toEqual('c')
  expect(get(object, ['a.0', 'b'], 'default')).toEqual('c')
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
