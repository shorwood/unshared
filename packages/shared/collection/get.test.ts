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
  expect(get(object, ['a', 'b', 'c'])).toEqual('d')
  expect(get(object, ['a', 'b', 'c'], 'default')).toEqual('d')
})

it('should return the default value if the path does not exist', () => {
  const object = { a: { b: { c: 'd' } } }
  expect(get(object, 'a.b.d')).toEqual(undefined)
  expect(get(object, 'a.b.d', 'default')).toEqual('default')
  expect(get(object, 'a.b.d.e')).toEqual(undefined)
  expect(get(object, 'a.b.d.e', 'default')).toEqual('default')
})
