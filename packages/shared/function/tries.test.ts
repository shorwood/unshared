import { expect, it } from 'vitest'
import { tries } from './tries'

const noop = () => {}
const throws = () => { throw new Error('Error') }
const now = () => true

it('should return the first non-undefined result', () => {
  const result = tries(noop, throws, now)
  expect(result).toBe(true)
})

it('should return undefined if all functions throw or return undefined', () => {
  const result = tries(throws, noop)
  expect(result).toBe(undefined)
})
