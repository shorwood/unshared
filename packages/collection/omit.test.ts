import { expect, it } from 'vitest'
import { omit } from './omit'

it('should omit the specified property', () => {
  const object = { foo: 1, bar: 2 }
  expect(omit(object, 'foo')).toEqual({ bar: 2 })
})

it('should omit the specified property path', () => {
  const object = { foo: 1, bar: 2, baz: 3 }
  expect(omit(object, ['foo', 'bar'])).toEqual({ baz: 3 })
})

it('should omit the specified property path using a function', () => {
  const object = { foo: { bar: 1 } }
  expect(omit(object, value => typeof value === 'number')).toEqual({ foo: { bar: 1 } })
})
