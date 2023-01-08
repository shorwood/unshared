
import { expect, it } from 'vitest'
import { set } from './set'

it.each([

  [1, 'a.b.c', {}, { a: { b: { c: 1 } } }],
  [1, 'a.b.c', { a: { b: { c: 2 } } }, { a: { b: { c: 1 } } }],
  [1, 'a.0.c', {}, { a: [{ c: 1 }] }],
  [1, '0.a.c', {}, { 0: { a: { c: 1 } } }],
  [1, '0.a.c', [], [{ a: { c: 1 } }]],

])('should set %s at path %s of the object %s', (value, path, object, expected) => {
  const result = set(object, path, value)
  expect(result).toEqual(expected)
})
