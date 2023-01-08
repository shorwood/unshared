import { nextTick } from 'node:process'
import { expect, it } from 'vitest'
import { resolvable } from './resolvable'

it('should initialize', () => {
  const state = resolvable()
  expect(state.pending).toEqual(true)
  expect(state.resolved).toEqual(false)
  expect(state.promise).toBeInstanceOf(Promise)
})

it('should resolve a value', async() => {
  const value = 'test'
  const state = resolvable<string>()
  nextTick(() => state.resolve(value))
  expect(state).resolves.toEqual(value)
  expect(state.promise).resolves.toEqual(value)
  expect(state).resolves.toHaveProperty('pending', false)
  expect(state).resolves.toHaveProperty('resolved', true)
})

it('should reject a value', async() => {
  const value = 'test'
  const state = resolvable<string>()
  nextTick(() => state.reject(value))
  expect(state).rejects.toEqual(value)
  expect(state.promise).rejects.toEqual(value)
  expect(state).rejects.toHaveProperty('pending', false)
  expect(state).rejects.toHaveProperty('resolved', false)
})

it('should be resolved after reset is called if already resolved', () => {
  const state = resolvable()
  state.resolve()
  state.reset()
  expect(state).resolves.toHaveProperty('pending', true)
  expect(state).resolves.toHaveProperty('resolved', false)
})

it('should be pending after reset is called if already rejected', () => {
  const state = resolvable()
  state.reject()
  state.reset()
  expect(state).resolves.toHaveProperty('pending', true)
  expect(state).resolves.toHaveProperty('resolved', false)
})

it('should be awaitable', async() => {
  const value = 'test'
  const state = resolvable<string>()
  nextTick(() => state.resolve(value))
  expect(state).resolves.toEqual(value)
  expect(state.promise).resolves.toEqual(value)
})
