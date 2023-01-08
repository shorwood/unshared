import { expect, it } from 'vitest'
import { pick } from './pick'

it('should pick the specified property', () => {
  const object = { foo: 1, bar: 2 }
  expect(pick(object, 'foo')).toEqual({ foo: 1 })
})

it('should pick the specified property path', () => {
  const object = { foo: 1, bar: 2, baz: 3 }
  expect(pick(object, ['foo', 'bar'])).toEqual({ foo: 1, bar: 2 })
})

it('should pick the specified property path using a function', () => {
  const object = { foo: { bar: 1 } }
  expect(pick(object, value => typeof value === 'number')).toEqual({})
})
