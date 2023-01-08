import { nextTick } from 'node:process'
import { expect, it } from 'vitest'
import { awaitable } from './awaitable'

it('should wrap an object with a promise that resolves with the same object', async() => {
  const object = { foo: 'bar' }
  const promise = new Promise<void>(resolve => nextTick(() => { object.foo = 'baz'; resolve() }))
  const result = awaitable(object, promise)
  expect(result).toEqual(object)
  expect(result).toHaveProperty('foo', 'bar')
  expect(result).resolves.toEqual(object)
  expect(result).resolves.toHaveProperty('foo', 'baz')
  expect(result.valueOf()).toEqual(object)
  expect(result.toString()).toEqual(object.toString())
  expect(result).not.toBeInstanceOf(Promise)
  await result
})

it('should wrap an array with a promise that resolves with the same array', async() => {
  const array = [1, 2, 3]
  const promise = new Promise<void>(resolve => nextTick(() => { array.push(4); resolve() }))
  const result = awaitable(array, promise)
  expect(result).toEqual(array)
  expect(result).toHaveLength(3)
  expect(result).resolves.toEqual(array)
  expect(result).resolves.toHaveLength(4)
  await result
})

it('should wrap even if no promise is provided', async() => {
  const object = { foo: 'bar' }
  const result = awaitable(object)
  expect(result).toEqual(object)
  expect(result).toHaveProperty('foo', 'bar')
  expect(result).resolves.toEqual(object)
  expect(result).resolves.toHaveProperty('foo', 'bar')
  await result
})

it('should wrap a promise with a promise that resolves with the same promise', async() => {
  const promise = new Promise<void>(resolve => resolve())
  const result = awaitable(promise)
  expect(result).toEqual(promise)
  expect(result).resolves.toEqual(promise)
  expect(result).resolves.toEqual('foo')
  await result
})
