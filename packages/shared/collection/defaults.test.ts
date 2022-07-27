/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { defaults } from './defaults'

it('should apply default values', () => {
  const object = { a: undefined, b: null, c: 0, d: false, e: '', f: {}, g: [] }
  const defaultValue = { a: 1, b: 2, c: 3, d: 4, e: 5, f: { a: 1 }, g: [1], h: 'h' }
  const expected = { a: 1, b: 2, c: 0, d: false, e: '', f: {}, g: [], h: 'h' }
  const result = defaults<any>(object, defaultValue)
  expect(result).toEqual(expected)
})

it('should apply default values to nested objects', () => {
  const object = { a: undefined, b: null, c: 0, d: false, e: '', f: {}, g: [] }
  const defaultValue = { a: 1, b: 2, c: 3, d: 4, e: 5, f: { a: 1 }, g: [1] }
  const expected = { a: 1, b: 2, c: 0, d: false, e: '', f: { a: 1 }, g: [1] }
  const result = defaults<any>(object, defaultValue, 1)
  expect(result, JSON.stringify(result)).toEqual(expected)
})
