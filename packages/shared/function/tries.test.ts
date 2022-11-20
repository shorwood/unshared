import { expect, it } from 'vitest'
import { tries } from './tries'

const noop = () => {}
const noopAsync = async() => {}
const throws = () => { throw new Error('Error') }
const throwsAsync = async() => { throw new Error('Error') }
const now = () => true
const nowAsync = async() => true

it('should return the first non-undefined result', () => {
  const result = tries(now, noop, throws)
  expect(result).toBe(true)
})

it('should return undefined if all functions throw or return undefined', () => {
  const result = tries(throws, noop)
  expect(result).toBe(undefined)
})

it('should return the first non-undefined result (async)', async() => {
  const result = await tries(noopAsync, throwsAsync, nowAsync)
  expect(result).toBe(true)
})

it('should return undefined if all functions throw or return undefined (async)', async() => {
  const result = await tries(throwsAsync, noopAsync)
  expect(result).toBe(undefined)
})

it('should return synchronous results before asynchronous results', async() => {
  const result = tries(now, nowAsync)
  expect(result).toBe(true)
})
