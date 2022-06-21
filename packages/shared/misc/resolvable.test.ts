import { expect, it } from 'vitest'
import { resolvable } from './resolvable'

it.concurrent('should initialize', () => {
  const state = resolvable()
  expect(state.pending).toBe(true)
  expect(state.resolved).toBe(false)
})

it.concurrent('should resolve a value', async() => {
  const value = 'test'
  const state = resolvable<string>()
  setTimeout(() => state.resolve(value), 10)
  expect(await state.promise).toBe(value)
  expect(state.pending).toBe(false)
  expect(state.resolved).toBe(true)
}, 20)

it.concurrent('should reject a value', async() => {
  const value = 'test'
  const state = resolvable<string>()
  setTimeout(() => state.reject(value), 10)
  expect(await state.promise.catch(error => error)).toBe(value)
  expect(state.pending).toBe(false)
  expect(state.resolved).toBe(false)
}, 20)

it.concurrent('should be resolved after reset is called if already resolved', () => {
  const state = resolvable()
  state.resolve()
  state.reset()
  expect(state.pending).toBe(true)
  expect(state.resolved).toBe(false)
})

it.concurrent('should be pending after reset is called if already rejected', () => {
  const state = resolvable()
  state.reject()
  state.reset()
  expect(state.pending).toBe(true)
  expect(state.resolved).toBe(false)
})
