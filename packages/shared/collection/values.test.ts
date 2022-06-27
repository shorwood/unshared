import { expect, it } from 'vitest'
import { values } from './values'

it('should cast an object as an array', () => {
  const object = { key1: { foo: 'bar' }, key2: { foo: 'baz' } }
  const result = values(object)
  expect(result).toEqual([{ foo: 'bar' }, { foo: 'baz' }])
  expect(result[0]).toStrictEqual(object.key1)
})

it('should return an array if passed an array', () => {
  const object = [{ foo: 'bar' }, { foo: 'baz' }]
  const result = values([{ foo: 'bar' }, { foo: 'baz' }])
  expect(result).toStrictEqual(object)
})

it('should store the original key in the array', () => {
  const object = { key1: { foo: 'bar' }, key2: { foo: 'baz' } }
  const result = values(object, 'key')
  expect(result).toEqual([{ key: 'key1', foo: 'bar' }, { key: 'key2', foo: 'baz' }])
  expect(result[0]).not.toStrictEqual(object.key1)
})
