import { expect, it } from 'vitest'
import { mergeDeep } from './mergeDeep'

it('should merge deeply nested objects', () => {
  expect(mergeDeep(
    { a: { b: { c: 1 } } },
    { a: { b: { d: 2 } } },
  )).toEqual({ a: { b: { c: 1, d: 2 } } })
})

it('should deeply nested merge arrays', () => {
  expect(mergeDeep(
    { a: { b: [1, 2] } },
    { a: { b: [3, 4] } },
  )).toEqual({ a: { b: [1, 2, 3, 4] } })
})

it('should deeply nested merge arrays of objects', () => {
  expect(mergeDeep(
    { a: { b: [{ a: 1 }] } },
    { a: { b: [{ a: 2 }] } },
  )).toEqual({ a: { b: [{ a: 1 }, { a: 2 }] } })
})

it('should not merge objects and arrays', () => {
  expect(mergeDeep(
    { a: [3, 4] },
    { a: { b: { c: 1 } } },
  )).toEqual({ a: { b: { c: 1 } } })
})
