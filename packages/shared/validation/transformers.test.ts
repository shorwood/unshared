/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { defaultToContext, defaultToContexts, defaultToValue, isEqualToContext, isEqualToValue, toContext, toContexts, toNull, toUndefined, toValue } from './transformers'

const context = { foo: 1, bar: 2 }

it('isEqualToValue should check if the value is equal to the expected value', () => {
  expect(isEqualToValue(1, 1)).toEqual(true)
  expect(isEqualToValue(1, 2)).toEqual(false)
})

it('isEqualToContext should check if the value at the given path in the context is equal to the expected value', () => {
  expect(isEqualToContext(1, 'foo', context)).toEqual(true)
  expect(isEqualToContext(2, 'bar', context)).toEqual(true)
  expect(isEqualToContext(3, 'baz', context)).toEqual(false)
})

it('defaultToValue should return the default value if the value is undefined', () => {
  expect(defaultToValue(1, 2)).toEqual(false)
  expect(defaultToValue(undefined, 2)).toEqual(2)
})

it('defaultToContext should return the default value from the context if the value is undefined', () => {
  expect(defaultToContext(1, 'foo', context)).toEqual(false)
  expect(defaultToContext(undefined, 'foo', context)).toEqual(1)
  expect(defaultToContext(undefined, 'bar', context)).toEqual(2)
  expect(defaultToContext(undefined, 'baz', context)).toEqual(undefined)
})

it('defaultToContexts should return the default values from the context if the value is undefined', () => {
  expect(defaultToContexts(1, ['foo'], context)).toEqual(false)
  expect(defaultToContexts(undefined, ['foo'], context)).toEqual([1])
  expect(defaultToContexts(undefined, ['bar'], context)).toEqual([2])
  expect(defaultToContexts(undefined, ['baz'], context)).toEqual([undefined])
})

it('toNull should return null', () => {
  expect(toNull()).toEqual(null)
})

it('toUndefined should return undefined', () => {
  expect(toUndefined()).toEqual(undefined)
})

it('toValue should return the new value', () => {
  expect(toValue(1, 2)).toEqual(2)
})

it('toContext should return the value at the given path in the context', () => {
  expect(toContext(1, 'foo', context)).toEqual(1)
  expect(toContext(2, 'bar', context)).toEqual(2)
  expect(toContext(3, 'baz', context)).toEqual(undefined)
})

it('toContexts should return the values at the given paths in the context', () => {
  expect(toContexts(1, ['foo'], context)).toEqual([1])
  expect(toContexts(2, ['bar'], context)).toEqual([2])
  expect(toContexts(3, ['baz'], context)).toEqual([undefined])
})
