import { nextTick } from 'node:process'
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
})

it('should wrap an array with a promise that resolves with the same array', async() => {
  const array = [1, 2, 3]
  const promise = new Promise<void>(resolve => nextTick(() => { array.push(4); resolve() }))
  const result = awaitable(array, promise)
  expect(result).toEqual(array)
  expect(result).toHaveLength(3)
  expect(result).resolves.toEqual(array)
  expect(result).resolves.toHaveLength(4)
})

it('should wrap even if no promise is provided', async() => {
  const object = { foo: 'bar' }
  const result = awaitable(object)
  expect(result).toEqual(object)
  expect(result).toHaveProperty('foo', 'bar')
  expect(result).resolves.toEqual(object)
  expect(result).resolves.toHaveProperty('foo', 'bar')
})

it('should wrap a promise with a promise that resolves with the same promise', async() => {
  const promise = new Promise<void>(resolve => resolve())
  const result = awaitable(promise)
  expect(result).toEqual(promise)
  expect(result).resolves.toEqual(promise)
  expect(result).resolves.toEqual('foo')
})

it('should wrap promise and return the resolved value', async() => {
  const object = { foo: 'bar' }
  const promise = new Promise<string>(resolve => resolve('bar'))
  const result = awaitable(object, promise)
  expect(result).toEqual(object)
  expect(result).resolves.toEqual('bar')
})

it('should preserver the `this` context of it\'s methods', async() => {
  const object = { value: 'bar', [Symbol.iterator]() { return this.value[Symbol.iterator]() } }
  const result = awaitable(object)
  const characters = []
  for (const value of result) characters.push(value)
  expect(characters).toEqual(['b', 'a', 'r'])
  expect(result).toHaveProperty('value', 'bar')
})

it('should throw an error if the promise is not a promise or a promise factory', () => {
  const object = { foo: 'bar' }
  const shouldThrow = () => awaitable(object, 'foo' as any)
  expect(shouldThrow).toThrow(TypeError)
})

it('should wrap a promise factory with a promise that resolves with the same promise', async() => {
  const object = { foo: 'bar' }
  const promise = new Promise<void>(resolve => resolve())
  const result = awaitable(object, () => promise)
  expect(result).toEqual(object)
  expect(result).resolves.toEqual(object)
})

it('should wrap a promise factory and return the resolved value', async() => {
  const object = { foo: 'bar' }
  const promise = new Promise<string>(resolve => resolve('bar'))
  const result = awaitable(object, () => promise)
  expect(result).toEqual(object)
  expect(result).resolves.toEqual('bar')
});
